import * as XLSX from 'xlsx';
import {
    fieldLabels,
    nmpqItems,
    dassDepressionItems,
    dassAnxietyItems,
    nomophobiaCategories,
    dassDepressionCategories,
    dassAnxietyCategories,
    resolveCategory,
} from './data.js';

const ALLOWED = {
    age_group: ['under18', '18plus'],
    gender: ['perempuan', 'laki-laki'],
    cohort: ['2023', '2024', '2025'],
    other_device: ['hanya_ponsel', 'tablet', 'laptop', 'konsol_gim', 'lainnya'],
    phone_activity: ['akademik', 'belanja', 'komunikasi', 'hiburan'],
    daily_usage: ['kurang_4', '4_6', 'lebih_6'],
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

async function handleSubmit(request, env) {
    const form = await request.formData();

    const name = (form.get('name') || '').toString().trim().slice(0, 255);
    const nim = (form.get('nim') || '').toString().trim().slice(0, 50);
    const errors = {};

    // Nama dan NIM kini wajib. Divalidasi juga di sini, bukan hanya di browser,
    // karena validasi sisi klien bisa dilewati.
    if (!name) errors.name = ['Nama atau inisial wajib diisi.'];
    if (!nim) errors.nim = ['NIM wajib diisi.'];

    for (const field of Object.keys(ALLOWED)) {
        const value = form.get(field);
        if (!value || !ALLOWED[field].includes(value.toString())) {
            errors[field] = [`Field ${field} tidak valid atau kosong.`];
        }
    }

    const nmpqAnswers = [];
    for (let i = 0; i < nmpqItems.length; i++) {
        const v = Number(form.get(`nmpq_answers[${i}]`));
        if (!Number.isInteger(v) || v < 1 || v > 7) {
            errors.nmpq_answers = ['Semua 20 pertanyaan NMP-Q wajib dijawab (1-7).'];
            break;
        }
        nmpqAnswers.push(v);
    }

    const dassDepAnswers = [];
    for (let i = 0; i < dassDepressionItems.length; i++) {
        const v = Number(form.get(`dass_depression_answers[${i}]`));
        if (!Number.isInteger(v) || v < 1 || v > 4) {
            errors.dass_depression_answers = ['Semua 7 pertanyaan DASS Depresi wajib dijawab (1-4).'];
            break;
        }
        dassDepAnswers.push(v);
    }

    const dassAnxAnswers = [];
    for (let i = 0; i < dassAnxietyItems.length; i++) {
        const v = Number(form.get(`dass_anxiety_answers[${i}]`));
        if (!Number.isInteger(v) || v < 1 || v > 4) {
            errors.dass_anxiety_answers = ['Semua 7 pertanyaan DASS Kecemasan wajib dijawab (1-4).'];
            break;
        }
        dassAnxAnswers.push(v);
    }

    if (Object.keys(errors).length > 0) {
        return jsonResponse({ message: 'Validasi gagal.', errors }, 422);
    }

    const nmpqScore = nmpqAnswers.reduce((a, b) => a + b, 0);
    // Skor DASS dikali 2 mengikuti konvensi skor resmi DASS-21 (dibandingkan ke cutoff yang juga sudah dikali 2).
    const dassDepScore = dassDepAnswers.reduce((a, b) => a + b, 0) * 2;
    const dassAnxScore = dassAnxAnswers.reduce((a, b) => a + b, 0) * 2;

    const nomophobiaCategory = resolveCategory(nmpqScore, nomophobiaCategories);
    const dassDepCategory = resolveCategory(dassDepScore, dassDepressionCategories);
    const dassAnxCategory = resolveCategory(dassAnxScore, dassAnxietyCategories);

    // Upload foto screentime (opsional) ke R2
    let screentimePath = null;
    const file = form.get('screentime_image');
    if (file && typeof file === 'object' && file.size > 0) {
        const allowedMimes = ['image/jpeg', 'image/png'];
        if (!allowedMimes.includes(file.type)) {
            return jsonResponse({ message: 'File harus berformat jpg atau png.' }, 422);
        }
        if (file.size > 5 * 1024 * 1024) {
            return jsonResponse({ message: 'Ukuran file maksimal 5MB.' }, 422);
        }
        const ext = file.type === 'image/png' ? 'png' : 'jpg';
        const key = `screentime/${crypto.randomUUID()}.${ext}`;
        await env.SCREENTIME_BUCKET.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type },
        });
        screentimePath = key;
    }

    const createdAt = new Date().toISOString();

    await env.DB.prepare(
        `INSERT INTO submissions (
            name, nim, age_group, gender, cohort, other_device, phone_activity, daily_usage,
            screentime_image_path, nmpq_answers, nmpq_score, nomophobia_category,
            dass_depression_answers, dass_depression_score, dass_depression_category,
            dass_anxiety_answers, dass_anxiety_score, dass_anxiety_category, created_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
        name || null,
        nim || null,
        form.get('age_group'),
        form.get('gender'),
        form.get('cohort'),
        form.get('other_device'),
        form.get('phone_activity'),
        form.get('daily_usage'),
        screentimePath,
        JSON.stringify(nmpqAnswers),
        nmpqScore,
        nomophobiaCategory.key,
        JSON.stringify(dassDepAnswers),
        dassDepScore,
        dassDepCategory.key,
        JSON.stringify(dassAnxAnswers),
        dassAnxScore,
        dassAnxCategory.key,
        createdAt
    ).run();

    return jsonResponse({
        nmpq_score: nmpqScore,
        nomophobia_category: nomophobiaCategory.key,
        dass_depression_score: dassDepScore,
        dass_depression_category: dassDepCategory.key,
        dass_anxiety_score: dassAnxScore,
        dass_anxiety_category: dassAnxCategory.key,
    });
}

function categoryTitle(categories, key) {
    const found = categories.find((c) => c.key === key);
    return found ? found.title : key;
}

async function handleExport(request, env) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token || token !== env.QUESTIONNAIRE_EXPORT_TOKEN) {
        return new Response('Forbidden', { status: 403 });
    }

    const { results } = await env.DB.prepare(
        'SELECT * FROM submissions ORDER BY created_at ASC'
    ).all();

    const headers = [
        'ID', 'Nama/Inisial', 'NIM', 'Usia', 'Jenis Kelamin', 'Angkatan',
        'Perangkat Lain', 'Aktivitas Ponsel', 'Durasi Harian', 'Link Gambar Screentime',
    ];
    nmpqItems.forEach((_, i) => headers.push(`NMPQ_${i + 1}`));
    headers.push('Skor NMP-Q', 'Kategori Nomophobia');
    dassDepressionItems.forEach((_, i) => headers.push(`DASS_Depresi_${i + 1}`));
    headers.push('Skor DASS Depresi', 'Kategori DASS Depresi');
    dassAnxietyItems.forEach((_, i) => headers.push(`DASS_Kecemasan_${i + 1}`));
    headers.push('Skor DASS Kecemasan', 'Kategori DASS Kecemasan', 'Waktu Submit');

    const rows = [headers];

    for (const s of results) {
        const nmpqAnswers = JSON.parse(s.nmpq_answers);
        const dassDepAnswers = JSON.parse(s.dass_depression_answers);
        const dassAnxAnswers = JSON.parse(s.dass_anxiety_answers);

        const imageUrl = s.screentime_image_path
            ? `${new URL(request.url).origin}/screentime-image/${s.screentime_image_path.replace('screentime/', '')}`
            : '';

        const row = [
            s.id,
            s.name || '',
            s.nim || '',
            fieldLabels.age_group[s.age_group] || s.age_group,
            fieldLabels.gender[s.gender] || s.gender,
            s.cohort,
            fieldLabels.other_device[s.other_device] || s.other_device,
            fieldLabels.phone_activity[s.phone_activity] || s.phone_activity,
            fieldLabels.daily_usage[s.daily_usage] || s.daily_usage,
            imageUrl,
            ...nmpqAnswers,
            s.nmpq_score,
            categoryTitle(nomophobiaCategories, s.nomophobia_category),
            ...dassDepAnswers,
            s.dass_depression_score,
            categoryTitle(dassDepressionCategories, s.dass_depression_category),
            ...dassAnxAnswers,
            s.dass_anxiety_score,
            categoryTitle(dassAnxietyCategories, s.dass_anxiety_category),
            s.created_at,
        ];
        rows.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    return new Response(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="nomophobia-submissions-${Date.now()}.xlsx"`,
        },
    });
}

async function handleScreentimeImage(request, env, key) {
    const object = await env.SCREENTIME_BUCKET.get(`screentime/${key}`);
    if (!object) {
        return new Response('Not found', { status: 404 });
    }
    return new Response(object.body, {
        headers: {
            'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000',
        },
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders() });
        }

        if (request.method === 'POST' && url.pathname === '/submit') {
            try {
                return await handleSubmit(request, env);
            } catch (err) {
                return jsonResponse({ message: 'Terjadi kesalahan server: ' + err.message }, 500);
            }
        }

        if (request.method === 'GET' && url.pathname === '/export/xlsx') {
            return handleExport(request, env);
        }

        if (request.method === 'GET' && url.pathname.startsWith('/screentime-image/')) {
            const key = url.pathname.replace('/screentime-image/', '');
            return handleScreentimeImage(request, env, key);
        }

        // Selain rute API di atas, layani sebagai aset statis (index.html, app.js, gambar, dll)
        return env.ASSETS.fetch(request);
    },
};

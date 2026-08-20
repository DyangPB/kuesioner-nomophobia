const nmpqScaleEntries = Object.entries(nmpqScale).map(([value, label]) => ({ value: Number(value), label }));
const dassScaleEntries = Object.entries(dassScale).map(([value, label]) => ({ value: Number(value), label }));

// ============================================================
// Overlay "Menghitung hasil Anda..."
// Latar gradien WebGL + teks status yang diketik satu per satu.
// Dipakai dari submit() selama request /submit berjalan.
// ============================================================

const CALC_MESSAGES = [
    'Menganalisis jawaban NMP-Q...',
    'Mengevaluasi gejala depresi...',
    'Menghitung tingkat kecemasan...',
];

// Kecepatan ketik disetel supaya satu siklus penuh (3 pesan) selesai dalam
// ~4 detik. Overlay menunggu siklus ini selesai, jadi kalau angka di bawah
// diubah, durasi tampil overlay ikut berubah.
const CALC_TYPING = {
    type: 22,   // ms per karakter saat mengetik
    hold: 400,  // jeda setelah kalimat selesai diketik
    erase: 11,  // ms per karakter saat menghapus
    gap: 100,   // jeda sebelum kalimat berikutnya
};

// Jaring pengaman: overlay tetap tampil minimal selama ini, bahkan kalau
// animasi teksnya gagal jalan. Tanpa ini, kegagalan animasi bikin overlay
// cuma berkedip sepersekian detik dan seolah-olah tidak pernah muncul.
const CALC_MIN_DISPLAY_MS = 2500;

const CALC_VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const CALC_FRAGMENT_SHADER = `
precision mediump float;
uniform float u_time;
varying vec2 v_texCoord;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.wwww) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 m0 = 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m * g, m0);
}

void main() {
    vec2 uv = v_texCoord;

    // Warna identik dengan gradien body: rose -> peach -> cream
    vec3 rose  = vec3(0.973, 0.788, 0.827); // #f8c9d3
    vec3 peach = vec3(0.984, 0.863, 0.769); // #fbdcc4
    vec3 cream = vec3(0.992, 0.925, 0.827); // #fdecd3

    float n1 = snoise(uv * 2.0 + u_time * 0.10);
    float n2 = snoise(uv * 1.5 - u_time * 0.05);

    vec3 color = mix(rose, cream, clamp(uv.x + uv.y + n1 * 0.2, 0.0, 1.0));
    color = mix(color, peach, clamp(n2 * 0.5 + 0.5, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}`;

let calcScene = null;
let calcRaf = null;
let calcTypingTimer = null;
let calcResizeObserver = null;

function prefersReducedMotion() {
    return typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Dibuat sekali lalu dipakai ulang kalau responden submit lagi setelah gagal.
function initCalcScene() {
    if (calcScene !== null) {
        return calcScene;
    }

    const canvas = document.getElementById('calc-canvas');
    if (!canvas) return null;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;

    const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, CALC_VERTEX_SHADER);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, CALC_FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    calcScene = {
        canvas,
        gl,
        uTime: gl.getUniformLocation(program, 'u_time'),
    };

    return calcScene;
}

function startCalcShader() {
    // Kalau WebGL tidak tersedia atau motion dikurangi, gradien CSS di
    // .calc-overlay tetap jadi latar — tidak ada yang perlu dibatalkan.
    if (prefersReducedMotion()) return;

    const scene = initCalcScene();
    if (!scene) return;

    const { canvas, gl, uTime } = scene;

    // Gradien halus, jadi render di DPR rendah sudah cukup dan jauh lebih
    // ringan untuk ponsel kelas menengah.
    const syncSize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.round((canvas.clientWidth || window.innerWidth) * ratio);
        const height = Math.round((canvas.clientHeight || window.innerHeight) * ratio);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    };

    syncSize();

    if (typeof ResizeObserver !== 'undefined') {
        calcResizeObserver = new ResizeObserver(syncSize);
        calcResizeObserver.observe(canvas);
    }

    const render = (time) => {
        syncSize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(uTime, time * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        calcRaf = requestAnimationFrame(render);
    };

    calcRaf = requestAnimationFrame(render);
}

// Mengetik ketiga pesan sekali jalan. Promise-nya selesai setelah pesan
// terakhir selesai diketik — dipakai submit() sebagai durasi minimum overlay.
function runCalcTyping() {
    const el = document.getElementById('calc-status');
    if (!el) return Promise.resolve();

    if (prefersReducedMotion()) {
        el.textContent = CALC_MESSAGES[CALC_MESSAGES.length - 1];
        return new Promise((resolve) => {
            calcTypingTimer = setTimeout(resolve, 1200);
        });
    }

    el.textContent = '';

    return new Promise((resolve) => {
        let messageIndex = 0;
        let charIndex = 0;
        let erasing = false;

        const tick = () => {
            const message = CALC_MESSAGES[messageIndex];
            let delay;

            if (erasing) {
                charIndex -= 1;
                el.textContent = message.slice(0, charIndex);
                delay = CALC_TYPING.erase;

                if (charIndex === 0) {
                    erasing = false;
                    messageIndex += 1;
                    delay = CALC_TYPING.gap;
                }
            } else {
                charIndex += 1;
                el.textContent = message.slice(0, charIndex);
                delay = CALC_TYPING.type;

                if (charIndex === message.length) {
                    // Pesan terakhir dibiarkan terbaca, tidak dihapus.
                    if (messageIndex === CALC_MESSAGES.length - 1) {
                        calcTypingTimer = setTimeout(resolve, CALC_TYPING.hold);
                        return;
                    }
                    erasing = true;
                    delay = CALC_TYPING.hold;
                }
            }

            calcTypingTimer = setTimeout(tick, delay);
        };

        tick();
    });
}

function startCalcOverlay() {
    document.body.style.overflow = 'hidden';

    // Shader dan animasi teks masing-masing diisolasi: kalau salah satu
    // gagal, overlay tetap tampil dan pengiriman kuesioner tetap jalan.
    try {
        startCalcShader();
    } catch (err) {
        console.error('[overlay] shader gagal dijalankan:', err);
    }

    try {
        return runCalcTyping();
    } catch (err) {
        console.error('[overlay] animasi teks gagal dijalankan:', err);
        return Promise.resolve();
    }
}

function stopCalcOverlay() {
    if (calcRaf !== null) {
        cancelAnimationFrame(calcRaf);
        calcRaf = null;
    }
    if (calcTypingTimer !== null) {
        clearTimeout(calcTypingTimer);
        calcTypingTimer = null;
    }
    if (calcResizeObserver !== null) {
        calcResizeObserver.disconnect();
        calcResizeObserver = null;
    }
    document.body.style.overflow = '';
}

document.addEventListener('alpine:init', () => {
    Alpine.data('questionnaireApp', () => ({
        step: 0,
        steps: ['landing', 'info', 'consent', 'biodata', 'nmpq', 'dass_depression', 'dass_anxiety', 'result'],

        submitting: false,
        showCalculating: false,
        submitError: '',
        results: null,
        carouselIndex: 0,
        carouselSlides: ['nmpq', 'dass_depression', 'dass_anxiety'],
        touchStartX: null,
        showInfografis: false,

        nmpqItems,
        dassDepressionItems,
        dassAnxietyItems,
        nmpqScaleEntries,
        dassScaleEntries,

        form: {
            name: '',
            age_group: '',
            gender: '',
            cohort: '',
            other_device: '',
            phone_activity: '',
            daily_usage: '',
            screentime_image: null,
            nmpq: Array(nmpqItems.length).fill(null),
            dass_depression: Array(dassDepressionItems.length).fill(null),
            dass_anxiety: Array(dassAnxietyItems.length).fill(null),
        },

        screentimePreviewName: '',

        get currentStepName() {
            return this.steps[this.step];
        },

        get activeCarouselCategory() {
            if (!this.results) return null;
            const slide = this.carouselSlides[this.carouselIndex];
            return this.results[slide];
        },

        get prevCarouselCategory() {
            if (!this.results) return null;
            const i = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
            return this.results[this.carouselSlides[i]];
        },

        get nextCarouselCategory() {
            if (!this.results) return null;
            const i = (this.carouselIndex + 1) % this.carouselSlides.length;
            return this.results[this.carouselSlides[i]];
        },

        carouselNext() {
            this.carouselIndex = (this.carouselIndex + 1) % this.carouselSlides.length;
        },

        carouselPrev() {
            this.carouselIndex = (this.carouselIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length;
        },

        goToCarouselSlide(index) {
            this.carouselIndex = index;
        },

        onTouchStart(event) {
            this.touchStartX = event.touches[0].clientX;
        },

        onTouchEnd(event) {
            if (this.touchStartX === null) return;
            const deltaX = event.changedTouches[0].clientX - this.touchStartX;
            const threshold = 40;
            if (deltaX > threshold) {
                this.carouselPrev();
            } else if (deltaX < -threshold) {
                this.carouselNext();
            }
            this.touchStartX = null;
        },

        goTo(name) {
            const idx = this.steps.indexOf(name);
            if (idx !== -1) {
                this.step = idx;
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        },

        next() {
            if (!this.validateCurrentStep()) {
                return;
            }

            if (this.currentStepName === 'dass_anxiety') {
                this.submit();
                return;
            }

            this.step = Math.min(this.step + 1, this.steps.length - 1);
            window.scrollTo({ top: 0, behavior: 'instant' });
        },

        back() {
            this.step = Math.max(this.step - 1, 0);
            window.scrollTo({ top: 0, behavior: 'instant' });
        },

        restart() {
            window.location.href = '/';
        },

        selectOption(group, index, value) {
            this.form[group][index] = value;
        },

        isSelected(group, index, value) {
            return this.form[group][index] === value;
        },

        onFileChange(event) {
            const file = event.target.files[0] || null;
            this.form.screentime_image = file;
            this.screentimePreviewName = file ? file.name : '';
        },

        onFileDrop(event) {
            const file = event.dataTransfer.files[0] || null;
            if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
                this.submitError = 'File harus berformat jpg atau png.';
                return;
            }
            this.form.screentime_image = file;
            this.screentimePreviewName = file ? file.name : '';
        },

        validateCurrentStep() {
            this.submitError = '';

            switch (this.currentStepName) {
                case 'biodata':
                    if (!this.form.age_group || !this.form.gender || !this.form.cohort ||
                        !this.form.other_device || !this.form.phone_activity || !this.form.daily_usage) {
                        this.submitError = 'Mohon lengkapi semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'nmpq':
                    if (this.form.nmpq.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'dass_depression':
                    if (this.form.dass_depression.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                case 'dass_anxiety':
                    if (this.form.dass_anxiety.some((v) => v === null)) {
                        this.submitError = 'Mohon jawab semua pertanyaan sebelum melanjutkan.';
                        return false;
                    }
                    return true;

                default:
                    return true;
            }
        },

        async submit() {
            this.submitting = true;
            this.submitError = '';

            // Overlay dinyalakan dulu, baru animasinya dijalankan setelah
            // Alpine benar-benar menampilkan elemennya (canvas butuh ukuran).
            this.showCalculating = true;
            await this.$nextTick();
            const sequenceDone = startCalcOverlay();

            const payload = new FormData();
            payload.append('name', this.form.name || '');
            payload.append('age_group', this.form.age_group);
            payload.append('gender', this.form.gender);
            payload.append('cohort', this.form.cohort);
            payload.append('other_device', this.form.other_device);
            payload.append('phone_activity', this.form.phone_activity);
            payload.append('daily_usage', this.form.daily_usage);
            if (this.form.screentime_image) {
                payload.append('screentime_image', this.form.screentime_image);
            }
            this.form.nmpq.forEach((v, i) => payload.append(`nmpq_answers[${i}]`, v));
            this.form.dass_depression.forEach((v, i) => payload.append(`dass_depression_answers[${i}]`, v));
            this.form.dass_anxiety.forEach((v, i) => payload.append(`dass_anxiety_answers[${i}]`, v));

            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: payload,
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Terjadi kesalahan saat mengirim kuesioner.');
                }

                const data = await response.json();
                const findCategory = (list, key) => list.find((c) => c.key === key);

                this.results = {
                    nmpq: findCategory(nomophobiaCategories, data.nomophobia_category),
                    dass_depression: findCategory(dassDepressionCategories, data.dass_depression_category),
                    dass_anxiety: findCategory(dassAnxietyCategories, data.dass_anxiety_category),
                };
                this.carouselIndex = 0;

                // Hasil sudah siap, tapi tunggu animasi overlay selesai satu
                // siklus dulu supaya transisinya tidak terpotong.
                await sequenceDone;
                this.goTo('result');
            } catch (err) {
                // Kalau gagal, overlay langsung ditutup supaya pesan error
                // di halaman kuesioner terlihat.
                this.submitError = err.message || 'Terjadi kesalahan saat mengirim kuesioner. Silakan coba lagi.';
            } finally {
                stopCalcOverlay();
                this.showCalculating = false;
                this.submitting = false;
            }
        },
    }));
});

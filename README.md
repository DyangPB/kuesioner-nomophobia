# Kuesioner Nomophobia — Versi Cloudflare Workers

Ini adalah **rewrite total** dari versi Laravel (`d:/IF/Testing/nomo`) supaya bisa deploy gratis di Cloudflare,
karena Cloudflare tidak menjalankan PHP. Stack-nya:

- **Cloudflare Workers** — backend (routing, validasi, scoring, export Excel)
- **Cloudflare D1** — database (pengganti SQLite Laravel)
- **Cloudflare R2** — penyimpanan foto screentime yang diunggah responden
- **Cloudflare Workers Static Assets** — hosting file statis (`public/index.html`, `app.js`, gambar)
- **Alpine.js** (lewat CDN) + **Tailwind CSS v4** — sama seperti versi Laravel, tampilan & alur wizard identik

Logic scoring, kategori hasil, dan seluruh copy/teks sudah disalin persis dari versi Laravel — **tidak ada
perubahan fungsional**, cuma bahasa & platform-nya beda.

## Struktur project

```
nomo-cf/
├── src/
│   ├── index.js       # Worker utama: routing /submit, /export/xlsx, serve static
│   └── data.js        # Sumber data kuesioner (item, skala, kategori hasil)
├── public/
│   ├── index.html      # Halaman wizard (pengganti questionnaire.blade.php)
│   ├── app.js           # Logic Alpine.js (import dari data.js)
│   ├── data.js           # Salinan src/data.js untuk dipakai browser
│   ├── app.css            # Hasil build Tailwind (JANGAN diedit manual, di-generate)
│   └── images/               # Ilustrasi, contoh screentime, infografis
├── migrations/
│   └── 0001_create_submissions.sql   # Schema D1 (setara migration Laravel)
└── wrangler.toml        # Konfigurasi Cloudflare (D1, R2, env var)
```

## Yang PERLU Anda ubah sebelum deploy

`wrangler.toml` masih berisi placeholder yang wajib diganti:

1. `database_id` di bagian `[[d1_databases]]` — didapat setelah membuat database D1 (lihat langkah 2 di bawah).
2. `QUESTIONNAIRE_EXPORT_TOKEN` di bagian `[vars]` — ganti dengan token rahasia Anda sendiri (bebas, contoh:
   generate lewat `openssl rand -hex 16` atau situs random string generator).

## Cara deploy (langkah demi langkah)

### 1. Install dependency

```bash
cd nomo-cf
npm install
```

### 2. Login ke Cloudflare & buat resource

```bash
npx wrangler login          # buka browser, login akun Cloudflare Anda

# Buat database D1
npx wrangler d1 create nomophobia-db
# → copy "database_id" yang muncul, tempel ke wrangler.toml

# Buat bucket R2
npx wrangler r2 bucket create nomophobia-screentime
```

### 3. Jalankan migration ke database produksi

```bash
npm run db:migrate:remote
```

### 4. Set token export Excel (jangan taruh secret di wrangler.toml untuk produksi)

```bash
npx wrangler secret put QUESTIONNAIRE_EXPORT_TOKEN
# lalu ketik token rahasia Anda saat diminta
```

Setelah ini, hapus/kosongkan baris `QUESTIONNAIRE_EXPORT_TOKEN` di `[vars]` pada `wrangler.toml`
(supaya tidak ke-commit ke git dalam bentuk plain text) — `wrangler secret` akan otomatis dipakai saat deploy.

### 5. Deploy

```bash
npm run deploy
```

Wrangler akan kasih URL akhir, formatnya `https://kuesioner-nomophobia.<subdomain-anda>.workers.dev`.

### 6. Test hasil deploy

- Buka URL-nya, isi kuesioner sampai selesai, pastikan hasil carousel muncul.
- Cek export Excel: `https://<url-worker-anda>/export/xlsx?token=<token yang Anda set>`

## Development lokal

```bash
npm run dev
```

Ini otomatis build CSS lalu jalankan `wrangler dev` — buka `http://127.0.0.1:8787` (atau port yang ditampilkan).
Wrangler dev pakai D1 & R2 versi **lokal** (tidak menyentuh data produksi), migration lokal:

```bash
npm run db:migrate:local
```

## Perbedaan dari versi Laravel (batasan teknis Cloudflare)

- **Export Excel tanpa thumbnail foto**: versi Laravel menyisipkan foto screentime langsung sebagai gambar di
  dalam sel Excel (pakai PhpSpreadsheet). Library JS gratis (`xlsx`/SheetJS community edition) yang dipakai di
  sini **tidak bisa** menyisipkan gambar — jadi kolom itu sekarang berisi **link URL** ke foto (klik untuk buka
  di tab baru), bukan gambar langsung ter-embed. Ini keterbatasan library, bukan bug.
- **Peringatan npm audit pada paket `xlsx`**: package `xlsx` versi npm punya kerentanan yang sudah diketahui
  (prototype pollution & ReDoS) yang HANYA berbahaya saat *membaca/parsing* file Excel dari sumber tidak
  tepercaya. Worker ini cuma *menulis* Excel (generate dari data sendiri), jadi risikonya rendah untuk
  penggunaan ini — tapi kalau mau lebih aman, bisa ganti ke versi terbaru langsung dari CDN resmi SheetJS
  (https://cdn.sheetjs.com) yang sudah dipatch.
- **Data responden tersebar di 2 layanan**: teks/skor di D1, foto di R2 — beda dari Laravel yang semuanya satu
  file SQLite + folder lokal. Kalau butuh backup, backup keduanya (`wrangler d1 export` dan `wrangler r2`).

## Sinkronisasi data pertanyaan

`src/data.js` dan `public/data.js` isinya harus SAMA PERSIS (yang satu dipakai Worker untuk validasi/scoring,
yang satu dipakai browser untuk render pertanyaan). Kalau nanti mengubah teks pertanyaan/kategori, ubah di
`src/data.js` dulu, lalu jalankan:

```bash
cp src/data.js public/data.js
```

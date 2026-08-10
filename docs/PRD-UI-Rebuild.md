# PRD — UI Rebuild: Nomophobia Questionnaire

**Product:** Kuesioner Nomophobia (NMP-Q + DASS-21) — web research instrument
**Owner / researcher contact:** Sherin Amalia — sherinamalia02@gmail.com
**Current stack:** Cloudflare Workers + D1 + R2, static assets = HTML + Alpine.js + Tailwind CSS v4
**Target:** Redesigned UI generated with **Google Stitch**, animated/interactive layer built with **React Bits**
**Doc version:** 1.0 — 2026-08-11
**Language of the product UI:** Bahasa Indonesia (all user-facing copy). This doc is in English because Stitch responds better to English prompts.

---

## 0. How to use this document

| Section | Audience | What to do with it |
|---|---|---|
| §1–§4 | Google Stitch | Paste **§4 (Design System)** first, as the opening prompt. It sets the art direction for every screen. |
| §5 | Google Stitch | Paste **one screen block at a time**. Each block is self-contained and copy-paste ready. Stitch produces better output with one screen per prompt than with a whole app in one shot. |
| §6–§8 | Developers | Stitch does **not** know what React Bits is and cannot generate it. Stitch gives you layout + visual design; §6 is the motion layer your devs add on top afterwards. |
| §9–§11 | Both | Constraints, acceptance criteria, and what must not change. |

**Stitch tips for this project:**
- Upload the existing screenshots / `public/images/` illustrations as reference images so Stitch keeps the hand-drawn, warm illustration style.
- Ask for **mobile-first** designs. ~80% of respondents fill this on a phone.
- All UI copy in the prompts below is in Indonesian on purpose. Add this line to every prompt: *"Keep all Indonesian text exactly as written — do not translate, do not paraphrase."*
- Iterate with follow-up edits ("make the Likert row larger on mobile") rather than regenerating from scratch.

---

## 1. Product context

A research questionnaire for medical students (cohorts 2023–2025) measuring **nomophobia** (NMP-Q, 20 items) alongside **depression and anxiety symptoms** (DASS-21 subscales, 7 items each). Respondents get an instant scored result plus educational content. Data lands in Cloudflare D1; optional screentime screenshots land in R2; the researcher exports everything as XLSX.

**Users:** medical students, 18–25, mostly on mobile, filling this once, unpaid, ~15 minutes of their time.

**Why redesign:** the current UI works but is visually flat and feels long. 20 NMP-Q items are stacked on a single scrolling page with bare numeric radio labels (`1 2 3 4 5 6 7`) and 10px text — high cognitive load and a real drop-off risk on mobile. There is no progress indicator, no save/resume, and a single generic error line at the bottom.

**Why it matters that we get this right:** two of the three instruments screen for depression and anxiety. The redesign must feel calm and non-alarming on those screens. Playful motion belongs on the landing and result screens, not on "Saya merasa hidup ini tidak berarti."

---

## 2. Goals

1. **Reduce perceived length** of the questionnaire — visible progress, chunked questions, momentum.
2. **Raise completion rate** — the primary success metric.
3. **Modernize the visuals** while keeping the existing warm rose/peach identity (it was designed for this study; do not throw it away).
4. **Add a considered motion layer** with React Bits — expressive on landing/result, restrained on clinical screens.
5. **Improve mobile ergonomics** — larger tap targets, labeled Likert anchors, no horizontal cramming.
6. **Keep accessibility and honesty** — this is a screening tool, not a diagnosis, and the disclaimer must stay prominent.

## 3. Non-goals

- ❌ Changing any questionnaire item text, scale wording, item order, or scoring thresholds. These are validated instruments (see §9).
- ❌ Changing the backend API contract (see §10).
- ❌ Adding accounts, login, or analytics tracking of individuals.
- ❌ Dark mode (the palette is a warm light gradient by design; a dark variant is out of scope for v1).
- ❌ Multi-language support.

---

## 4. Design system — PASTE THIS INTO STITCH FIRST

> **Prompt block — copy from here ↓**

Design a warm, calm, editorial-feeling web app for a psychology research questionnaire aimed at university students in Indonesia. Mobile-first, also responsive to tablet and desktop. The mood is gentle, human, and reassuring — not clinical, not corporate, not "startup SaaS".

**Color palette (use exactly these):**
- Page background: a soft diagonal gradient at 135°, from `#f8c9d3` (rose pink) at 0%, through `#fbdcc4` (peach) at 55%, to `#fdecd3` (warm cream) at 100%.
- Primary text: `#3a2b30` (deep warm brown)
- Primary deep accent: `#7a3350` (deep plum-rose) — buttons, active states, headings accents
- Primary light accent: `#c9587e` (rose) — used only as the light end of gradients
- Muted border / inactive stroke: `#b06a82` at 40–100% opacity
- Card surface: white at 35% opacity with a 6px backdrop blur, corner radius 24px, no hard border
- Primary button: pill shape (fully rounded), 90° linear gradient `#c9587e` → `#7a3350`, white text, soft shadow `0 6px 16px rgba(122,51,80,0.35)`
- Secondary button: pill shape, transparent background, 2px border `#7a3350`, text `#7a3350`
- Result severity badges — circular, 56px, white bold numeral inside: level 1 green `#7cc576`, level 2 yellow `#e8c34a`, level 3 orange `#f0a15d`, level 4 red `#e2604f`, level 5 dark red `#8a2c40`

**Typography:**
- Headings: **Playfair Display**, weights 600/700/800. Large, generous line-height, sentence case (often all-lowercase for playful lines).
- Body: **Lora**, weights 400/500/600. Comfortable reading size, relaxed line-height (1.6+).
- Never use a geometric sans for headings. The serif pairing is the identity.

**Shape & texture language:**
- Pill-shaped buttons and inputs (fully rounded, never square).
- Frosted glass cards floating on the gradient.
- Soft, hand-drawn illustration style for spot images, with a paper-like feel (existing illustrations use multiply blend so they sit on the gradient without a white box — preserve that look).
- Floating soft white cloud shapes as ambient background decoration on the landing screen.
- Generous whitespace. Content column max-width ~640px on mobile/tablet, up to ~1100px on desktop, always centered.

**Component conventions:**
- Radio option: 24px circle, 2px border `#b06a82`, filled with a gradient dot when selected, with a springy "pop" scale-in on select.
- Text input: full-width pill, 1px border `#b06a82`, translucent white fill, border darkens to `#7a3350` on focus.
- File upload: full-width dashed-border drop zone, 2px dashed `#b06a82`, 16px radius, upload arrow icon, translucent white fill.
- Disclaimer/note blocks: frosted card, smaller text, centered.

**Accessibility requirements:**
- Minimum tap target 44×44px.
- Body text never smaller than 14px; helper text never smaller than 12px.
- All interactive elements need a visible focus ring in `#7a3350`.
- Text contrast must pass WCAG AA against the light gradient — use `#3a2b30` or `#7a3350`, never light grey.

Keep all Indonesian text exactly as written — do not translate, do not paraphrase.

> **↑ end of prompt block**

---

## 5. Screens — PASTE ONE BLOCK AT A TIME INTO STITCH

The app is a linear wizard of 8 steps plus one overlay. Step order (unchanged):

`landing → info → consent → biodata → nmpq → dass_depression → dass_anxiety → result` (+ `infografis` overlay reachable from the result screen)

### 5.1 Screen 1 — Landing

> **Prompt block ↓**

Design the landing screen of the questionnaire app. Full-height, vertically centered, centered text, with soft white cloud shapes floating in the background at the edges (some drifting in from the left, some from the right — they should read as ambient decoration, not content).

Content, top to bottom:
1. Large serif headline, up to ~2 lines, max-width ~640px: **"Seberapa Lengket Kamu terhadap Ponselmu?"**
2. Supporting paragraph, smaller, max-width ~440px: **"Ayo cari tahu dengan menjadi partisipan penelitian dan mengisi kuisioner kecenderungan Nomophobia (No Mobile Phone Phobia) pada diri kamu!"**
3. A single primary pill button, lowercase label: **"selanjutnya"**

Also show a small, unobtrusive line near the bottom: **"± 15 menit · 41 pertanyaan · anonim"**

No navigation bar, no logo, no footer. The headline should feel like a magazine cover line.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.2 Screen 2 — Info / Education

> **Prompt block ↓**

Design an educational screen that introduces the concept of nomophobia before the questionnaire begins. Three illustrated points stacked vertically, each centered: an illustration on top, a short paragraph below it.

Header, centered:
- Small serif line: **"tapi sebelum itu,"**
- Large serif headline below it: **"kenali sedikit mengenai nomophobia!"**

Point 1 — illustration of a person chained to a phone (~200px wide), then text:
**"nomophobia (no mobile phone phobia) adalah kondisi cemas, takut, maupun tidak nyaman ketika seseorang tidak dapat mengakses ponselnya."**
(bold the phrase "nomophobia (no mobile phone phobia)")

Point 2 — illustration of a disconnected Wi-Fi icon (~160px wide), then text:
**"nomophobia dapat timbul karena berbagai keadaan, contohnya seperti kehabisan daya ponsel atau kehilangan akses internet saat dibutuhkan."**

Point 3 — illustration of a person hugging their knees, anxious (~200px wide), then text:
**"nomophobia saat ini telah berkembang menjadi fenomena psikologis yang umum di dunia dan telah dikaitkan dengan berbagai psikopatologi, seperti depresi dan kecemasan."**

Bottom: centered primary pill button **"selanjutnya"**.

Illustrations sit directly on the gradient background with no white card behind them.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.3 Screen 3 — Consent

> **Prompt block ↓**

Design an informed-consent screen. One large frosted glass card, centered vertically, containing:

Bold line: **"Kuesioner ini terdiri dari:"**
Then a numbered list:
1. **"Tujuh pertanyaan tentang identitas dan sosiodemografi"**
2. **"Dua puluh pertanyaan mengenai nomophobia (Nomophobia Questionnaire)"**
3. **"Tujuh pertanyaan mengenai gejala depresi (DASS-21 Subskala Depresi)"**
4. **"Tujuh pertanyaan mengenai gejala kecemasan (DASS-21 Subskala Kecemasan)"**

Then these paragraphs, in order:
- **"Pengisian kuesioner membutuhkan waktu ± 15 menit."** (bold "15 menit")
- **"Setelah mengisi kuesioner, Anda akan memperoleh hasil skor tingkat gejala nomophobia beserta edukasi terkait nomophobia."** (bold "hasil skor tingkat gejala nomophobia" and "edukasi terkait nomophobia")
- **"Tenang saja, penelitian ini tidak menimbulkan risiko maupun efek samping yang membahayakan!"**
- Bold: **"Klik jika Anda bersedia menjadi partisipan penelitian!"**

Below the card, centered, one wide primary pill button with a long label: **"saya bersedia dan mulai pengisian kuesioner"**. The button must wrap gracefully on mobile without overflowing.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.4 Screen 4 — Biodata / Sociodemographics

> **Prompt block ↓**

Design a form screen collecting participant identity and phone habits. A slim sticky progress bar sits at the top of the viewport showing step 1 of 4 of the questionnaire portion.

Centered serif page title: **"Identitas dan Kebiasaan Partisipan"**

Then these fields, each as its own visually separated group with a bold serif label above it:

1. Label **"Nama atau Inisial"** — a single full-width pill text input, no placeholder, marked optional.

2. Label **"Usia"** — two radio options stacked: **"< 18 tahun"**, **"≥ 18 tahun"**

3. Label **"Jenis Kelamin"** — two radio options side by side: **"Perempuan"**, **"Laki-laki"**

4. Label **"Angkatan"** — three radio options in a row: **"2023"**, **"2024"**, **"2025"**

5. Label **"Apakah anda memiliki perangkat lain selain ponsel?"** — five stacked radio options: **"Hanya ponsel"**, **"Tablet/iPad/sejenis"**, **"Laptop/komputer/sejenis"**, **"Konsol gim seperti Nintendo Switch/PlayStation/sejenis"**, **"Lainnya"**

6. Label **"Kegiatan seperti apa yang Anda lakukan ketika menggunakan ponsel?"** — four stacked radio options with long multi-line labels that must wrap cleanly, with the radio circle top-aligned to the first line of text:
   - **"Akademik (belajar/membaca literatur kedokteran (e-book, artikel jurnal, website kesehatan); mengerjakan tugas atau quiz/mengakses aplikasi kedokteran interaktif (complete anatomy, HeartSounds, dll); menonton video pembelajaran)"**
   - **"Belanja atau berbisnis di e-commerce atau platform sejenis"**
   - **"Komunikasi (chat, telepon, video-call)"**
   - **"Hiburan (bermain gim, mengakses media sosial, streaming video pendek/film, menggambar, mendengarkan musik)"**

7. Label **"Berapa lama rata-rata durasi penggunaan ponsel Anda per hari?"** — three stacked radio options: **"< 4 jam"**, **"4-6 jam"**, **"> 6 jam"**

8. Label **"Silahkan mengunggah rata-rata penggunaan ponsel anda berdasarkan screentime mingguan pada bagian pengaturan ponsel Anda!"** with a lighter "(opsional)" tag. Below it: two example screenshots side by side, each with a caption underneath — left caption **"Android: Setelan/Pengaturan > Digital Wellbeing > grafik rata-rata mingguan"**, right caption **"iOS: Setelan/Pengaturan > Screen Time/Waktu Layar > Mingguan"**. Then a small helper line: **"Contoh acuan: tangkapan layar durasi penggunaan ponsel mingguan. (opsional jika ponsel Anda tidak memiliki fitur laporan mingguan)"**. Then a full-width dashed-border drop zone with an upload arrow icon, primary text **"Klik atau tarik file ke sini"** and secondary text **"format jpg/png, maks 5MB"**.

Bottom row: secondary outline pill button **"← kembali"** on the left, primary pill button **"selanjutnya"** on the right. Reserve a line above the buttons for an error message in red.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.5 Screen 5 — NMP-Q (20 items, 7-point Likert) ⭐ most important screen

This is where drop-off happens. It gets the biggest UX change.

> **Prompt block ↓**

Design the main questionnaire screen: 20 statements each answered on a 7-point agreement scale. Optimize hard for mobile — this is the longest part of the survey and users must not feel overwhelmed.

Top of viewport: a sticky, slim progress bar with a label like **"Pertanyaan 5 dari 20"**, plus the section name **"NMP-Q"**. The bar fills with the `#c9587e → #7a3350` gradient.

Page header (scrolls away):
- Serif title: **"Nomophobia Questionnaire (NMP-Q)"**
- Intro paragraph: **"Kuesioner ini bertujuan mengukur derajat keparahan nomophobia, mulai dari tidak ada nomophobia, nomophobia ringan, nomophobia sedang, nomophobia berat. Bacalah setiap pertanyaan dengan hati-hati dan pilih satu jawaban yang sesuai dengan kondisi diri Anda selama satu bulan terakhir. Tidak ada jawaban yang benar maupun salah!"**
- A frosted card showing the scale legend, titled **"Skala penelitian adalah sebagai berikut:"** and listing:
  `1 = Sangat tidak setuju`, `2 = Tidak setuju`, `3 = Agak tidak setuju`, `4 = Netral`, `5 = Agak setuju`, `6 = Setuju`, `7 = Sangat setuju`
  On mobile this legend should be collapsible, defaulting to open, with a small "sembunyikan" toggle.

Then the question list. Present the 20 items in **chunks of 5 per view**, not all 20 at once — each chunk is a card group, and the user advances chunk by chunk. Show 4 chunks total.

Each question is its own frosted card containing:
- The statement text at a comfortable reading size (this is the most important text on screen — do not shrink it).
- Below it, a 7-point Likert selector rendered as a horizontal row of 7 circular radio buttons, evenly spaced, each with its number beneath. The circles must grow in visual weight from left to right is NOT required — keep them uniform. Minimum 44px tap target each.
- Anchor labels under the ends of the row: **"Sangat tidak setuju"** on the far left, **"Sangat setuju"** on the far right, small and muted.
- When a question is answered, the card gets a subtle filled/settled state so users can see at a glance what is done.

Example statement to render in the mockup: **"Saya merasa tidak nyaman tidak memiliki akses informasi melalui smartphone saya."**

If the 7-circle row is too cramped at 360px width, use a segmented pill control that spans the full width instead, still with the numbers 1–7 and the two anchor labels underneath. Show both variants.

Bottom row: secondary outline pill **"← kembali"** left, primary pill **"selanjutnya →"** right, with an error line reserved above them in red reading **"Mohon jawab semua pertanyaan sebelum melanjutkan."**

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.6 Screen 6 & 7 — DASS-21 Depression and Anxiety (7 items each, 4-point scale)

Two near-identical screens. Generate once, then ask Stitch for the anxiety variant.

> **Prompt block ↓**

Design a short symptom-screening screen — 7 statements, each answered on a 4-point frequency scale. The tone here must be noticeably calmer and more respectful than the rest of the app: more whitespace, softer motion, nothing playful. These questions are about depressive symptoms.

Sticky progress bar at top, labeled **"DASS-21 · Depresi"**.

Header, centered:
- Serif title: **"Depression, Anxiety, and Stress Scale-21 (DASS-21)"**
- Serif subtitle beneath: **"Subskala depresi"**
- Intro paragraph: **"Kuesioner ini bertujuan mengukur derajat keparahan gejala depresi. Bacalah setiap pertanyaan dengan hati-hati dan pilih satu jawaban yang sesuai dengan diri Anda selama satu minggu terakhir. Tidak ada jawaban yang benar maupun salah!"**
- Frosted legend card titled **"Skala penelitian adalah sebagai berikut:"** listing:
  `0 = Tidak sesuai dengan saya sama sekali atau tidak pernah`
  `1 = Sedikit sesuai dengan saya pada saat tertentu`
  `2 = Cukup sesuai dengan saya pada sebagian besar waktu`
  `3 = Sangat sesuai dengan saya hampir setiap waktu`

Then 7 question cards, all visible on one scrolling page (this section is short — do not chunk it). Each card: the statement, centered, then a row of 4 large radio options. Unlike the NMP-Q screen, here each of the 4 options shows its **full text label** next to the circle, stacked vertically — the wording matters and users should not have to look back at the legend.

The 7 statements, in this exact order:
1. **"Saya tidak dapat merasakan perasaan yang positif."**
2. **"Saya sulit mendapatkan semangat untuk melakukan sesuatu."**
3. **"Saya merasa tidak memiliki masa depan."**
4. **"Saya merasa sedih dan murung."**
5. **"Saya tidak antusias terhadap sesuatu."**
6. **"Saya merasa saya tidak berharga."**
7. **"Saya merasa hidup ini tidak berarti."**

Bottom row: secondary outline pill **"← kembali"**, primary pill **"selanjutnya"**.

Keep all Indonesian text exactly as written.

> **↑ end**

**Follow-up prompt for the anxiety variant:** same screen, subtitle **"Subskala kecemasan"**, progress label **"DASS-21 · Kecemasan"**, intro paragraph **"Kuesioner ini bertujuan mengukur derajat keparahan gejala kecemasan. Bacalah setiap pertanyaan dengan hati-hati dan pilih satu jawaban yang sesuai dengan diri Anda selama satu minggu terakhir. Tidak ada jawaban yang benar maupun salah!"**, and these 7 statements:

1. Saya merasa rongga mulut saya kering.
2. Saya mengalami kesulitan bernapas (misalnya seringkali terengah-engah atau tidak dapat bernapas padahal tidak melakukan aktivitas fisik sebelumnya).
3. Saya merasa gemetar (misalnya pada tangan).
4. Saya merasa khawatir dengan situasi dimana saya mungkin menjadi panik dan mempermalukan diri sendiri.
5. Saya merasa hampir panik.
6. Saya merasakan kerja jantung saya (berdebar-debar) saat tidak melakukan aktivitas fisik.
7. Saya merasa ketakutan tanpa alasan yang jelas.

The final button on the anxiety screen reads **"lihat hasil →"**, and has a loading state showing a spinner with the text **"mengirim..."**.

---

### 5.7 Screen 7b — Submitting / Analyzing interstitial (NEW)

The current app already waits ~3 seconds after submit before revealing results. Right now that time is a bare spinner. Turn it into a moment.

> **Prompt block ↓**

Design a full-screen loading/transition state shown for about 3 seconds after the user submits the questionnaire, before results appear. Centered, calm, no progress percentage.

- A soft animated visual centerpiece (abstract, warm, on-palette — not a medical or clinical icon).
- Serif line: **"Menghitung hasil Anda..."**
- Smaller supporting line that cycles through three reassuring messages: **"Menganalisis jawaban NMP-Q"**, **"Menganalisis gejala depresi"**, **"Menganalisis gejala kecemasan"**

No buttons. No way to cancel.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.8 Screen 8 — Results carousel

> **Prompt block ↓**

Design a results screen built as a 3-slide carousel. The three slides are: NMP-Q result, DASS-21 depression result, DASS-21 anxiety result.

Layout: one large centered frosted card as the active slide, with a smaller, blurred, dimmed, slightly scaled-down "peek" card partially visible on each side (hidden on mobile, visible from tablet up). Circular arrow buttons pinned at the left and right edges of the viewport, vertically centered. Dot indicators below the card. Swipeable on touch.

Slide title above the card changes per slide:
- Slide 1: **"Hasil Nomophobia Questionnaire (NMP-Q)"**
- Slide 2: **"Hasil DASS-21 Subskala Depresi"**
- Slide 3: **"Hasil DASS-21 Subskala Kecemasan"**

Active card contents, centered:
- A large circular severity badge with a white numeral inside (1–5). Colors by level: 1 green `#7cc576`, 2 yellow `#e8c34a`, 3 orange `#f0a15d`, 4 red `#e2604f`, 5 dark red `#8a2c40`.
- A serif headline stating the result, e.g. **"Anda mengalami nomophobia sedang."**
- One or two body paragraphs of explanation and advice, e.g. **"Hasil kuesioner menunjukkan bahwa Anda memiliki kecenderungan nomophobia pada tingkat sedang. Kondisi ini menunjukkan bahwa rasa takut atau tidak nyaman ketika tidak dapat mengakses ponsel mulai dirasakan dalam berbagai situasi dan berpotensi memengaruhi kenyamanan saat menjalani aktivitas sehari-hari."** and **"Membiasakan penggunaan ponsel secara bijak dan meluangkan waktu tanpa ponsel dapat membantu mencegah meningkatnya rasa cemas saat tidak dapat mengaksesnya."**
- Only on slide 1: an underlined text link **"Klik disini untuk mengakses infografis seputar nomophobia"**

All three cards must be the same height so the layout does not jump between slides.

Below the carousel, a frosted disclaimer card with small centered text:
**"PERHATIAN! Ketiga kuesioner tersebut merupakan self-report questionnaire yang dipengaruhi oleh persepsi subjektif partisipan. NMP-Q dan DASS-21 subskala depresi dan kecemasan merupakan INSTRUMEN SKRINING, bukan sebagai alat diagnostik. Skor yang diperoleh hanya menggambarkan tingkat kecenderungan maupun gejala yang dilaporkan oleh responden. Diagnosis gangguan depresi maupun kecemasan hanya dapat ditegakkan melalui pemeriksaan lanjutan dari psikiater, psikolog klinis, maupun tenaga profesional yang terkait."**

Then:
**"Terima kasih telah berpartisipasi dalam pengisian kuesioner ini! Bila ada pertanyaan, silahkan menghubungi kontak peneliti:"**
**"Sherin Amalia"**
**"e-mail: sherinamalia02@gmail.com"**
**"Line / whatsapp: rinevlier / 082281499850"**

A primary pill button fixed at the bottom center of the viewport: **"kembali ke menu awal"**.

Keep all Indonesian text exactly as written.

> **↑ end**

---

### 5.9 Screen 9 — Infographic overlay

> **Prompt block ↓**

Design a simple overlay screen showing an educational infographic image.

- Centered serif title: **"Mari mengenal nomophobia!"**
- Below it, a tall portrait infographic image, max-width ~380px, centered, with rounded corners (16px), a soft shadow, and a thin border. It should be tappable to open full-screen / zoom.
- Below the image, a row with a secondary outline pill button **"← kembali"** on the left and a primary pill button **"unduh infografis"** on the right, both within the image's width.

Keep all Indonesian text exactly as written.

> **↑ end**

---

## 6. Motion & interaction layer — React Bits mapping

> ⚠️ **Stitch cannot generate this.** Stitch outputs static HTML/CSS or a Figma file. This section is the implementation brief for whoever builds the React app on top of Stitch's output.

React Bits (https://reactbits.dev) is a copy-paste component library — you paste component source into your project rather than installing a package. Component names below are the ones to look for; **verify exact names and props against the current site**, the library evolves.

### 6.1 Motion principles for this product

1. **Motion budget scales inversely with clinical seriousness.** Landing and results: expressive. Biodata and NMP-Q: functional feedback only. DASS depression/anxiety: near-zero decorative motion.
2. **Every animation must be skippable.** Respect `prefers-reduced-motion: reduce` — disable all decorative motion, keep only opacity fades under 150ms.
3. **Nothing animates on a loop in the user's peripheral vision while they read a question.** Ambient background animation is landing/result only.
4. **No motion that delays input.** Entrance animations must never gate interactivity.

### 6.2 Per-screen component map

| Screen | React Bits component | Purpose | Notes |
|---|---|---|---|
| **Landing** | `Aurora` **or** `Silk` **or** `Threads` background | Replaces the CSS cloud shapes with a living gradient | ⚠️ WebGL — see §7.3 budget. `Silk` reads warmest with this palette. Fallback: keep the existing CSS clouds. |
| Landing | `SplitText` or `BlurText` | Headline reveals word-by-word | Use on the H1 only, once |
| Landing | `AnimatedContent` / `FadeContent` | Staggered entry for subhead + CTA | Replaces current `landing-fade-in` CSS, delays .1s/.3s/.5s |
| Landing | `StarBorder` or `Magnet` | CTA button treatment | Pick one, not both |
| Landing | `ClickSpark` | Global click feedback | Optional, app-wide |
| **Info** | `AnimatedContent` (scroll-triggered) | Each of the 3 illustration blocks fades up as it enters view | Threshold ~0.2 |
| Info | `ScrollReveal` | Paragraph text reveal | Keep subtle |
| **Consent** | `SpotlightCard` | The consent card gets a cursor-following highlight | Desktop only |
| Consent | `FadeContent` | Card entrance | |
| **All wizard steps** | `Stepper` | The sticky progress indicator | This is the single highest-value addition. React Bits `Stepper` may need adapting since our steps are externally controlled. |
| **Biodata** | `AnimatedList` or staggered `AnimatedContent` | Field groups enter in sequence | Cheap, high polish |
| Biodata | `PixelTransition` or a simple scale-in | Screentime upload preview appearance | |
| **NMP-Q** | `AnimatedContent` per chunk | Each 5-question chunk slides in | Direction reverses on "kembali" |
| NMP-Q | Custom springy radio (keep existing CSS) | The `cubic-bezier(0.34, 1.56, 0.64, 1)` pop already in `app.css` is good — port it, don't replace it | |
| NMP-Q | `ElasticSlider` | **Alternative** Likert input for mobile | Evaluate: a 1–7 slider may be faster than 7 tap targets, but sliders bias responses toward the middle. **Test before adopting — do not ship without a pilot.** |
| **DASS ×2** | `FadeContent` only | Minimal — opacity only, ~200ms | Deliberately restrained |
| **Submitting** | `Orb` or `Ballpit` centerpiece + `TextType` / `RotatingText` for the cycling status line | Fills the existing 3-second wait | The one place a "wow" moment costs nothing |
| **Result** | `Carousel` or `CardSwap` | The 3-slide result carousel | Must keep: equal card heights, blurred side peeks, dot indicators, swipe, arrow keys |
| Result | `CountUp` | Animate the score number climbing to its value | Requires exposing the numeric score in the UI — see §8, this is a small content addition |
| Result | `Confetti` / `ClickSpark` | **Only** for the green "no nomophobia / no symptoms" result | Never celebrate a severe result |
| Result | `ShinyText` or `GradientText` | The result headline | |
| Result | `TiltedCard` | Result card tilt on pointer move | Desktop only, low intensity |
| **Infographic** | `Lens` / zoom-on-tap, or `PixelTransition` | Infographic reveal + magnify | |

### 6.3 Explicitly rejected

- ❌ `Hyperspeed`, `Balatro`, `LetterGlitch`, `FaultyTerminal`, `Galaxy`, `Lightning` — wrong register entirely for a mental-health instrument.
- ❌ `SplashCursor`, `BlobCursor`, `ImageTrail` — distracting while reading, and dead weight on mobile where there is no cursor.
- ❌ Any animated background on the DASS screens.
- ❌ Confetti on any non-green result.

---

## 7. Technical plan

### 7.1 The stack change this requires

React Bits is React-only. The app today is Alpine.js served as static files. This rebuild means introducing React.

**Recommended path:**
1. Add **Vite + React 18/19** building into `public/` (or better: build to `dist/` and point `[assets] directory` in `wrangler.toml` at it).
2. Keep the Worker (`src/index.js`) **completely unchanged** — it already just serves `env.ASSETS.fetch(request)` for anything that isn't an API route.
3. Keep Tailwind v4; React Bits components are Tailwind-friendly. Preserve the custom CSS in `src/css/app.css` (buttons, radio pop, badges) as the base layer.
4. `src/data.js` stays the single source of truth. The React app imports it directly — this finally kills the manual `cp src/data.js public/data.js` sync step documented in the README.
5. Dependencies React Bits components pull in, added only as needed: `motion` (Framer Motion), `gsap`, and `ogl` or `three` for WebGL backgrounds.

**Build script changes in `package.json`:**
```
"build": "vite build",
"dev": "vite build --watch & wrangler dev",
"deploy": "vite build && wrangler deploy"
```

### 7.2 Migration risk

The Alpine state machine in `public/app.js` is small and clean — `step`, `form`, `validateCurrentStep()`, `submit()`, carousel index. Porting it to React state (or a `useReducer`) is a few hours of work, not a rewrite. **Port the logic verbatim first, verify parity, then restyle.** Do not do both at once.

### 7.3 Performance budget

Respondents are on Indonesian mobile networks. Hard limits:

| Metric | Budget |
|---|---|
| Initial JS (gzipped) | ≤ 180 KB |
| LCP on 4G, mid-tier Android | ≤ 2.5 s |
| Total page weight, landing | ≤ 600 KB |

**This is the constraint that decides whether WebGL backgrounds ship.** `three.js` alone blows the JS budget; `ogl` is far lighter (~30 KB) — prefer OGL-based React Bits backgrounds, load them lazily with `React.lazy`, and only on the landing and result screens. If the budget cannot be met, keep the existing pure-CSS cloud animation — it costs 0 KB of JS and already looks good.

### 7.4 Accessibility requirements

- Full keyboard navigation: Likert rows are radio groups navigable with arrow keys, one tab stop per question.
- Correct semantics: `<fieldset>` + `<legend>` per question, `role="radiogroup"`, `aria-required`.
- `prefers-reduced-motion: reduce` disables all decorative motion (this is a hard requirement, not a nice-to-have).
- Screen reader announces progress changes via `aria-live="polite"`.
- Focus moves to the first unanswered question when validation fails, instead of only showing a bottom error line.

---

## 8. UX improvements included in this rebuild

Beyond visual restyling, these behavior changes are in scope:

| # | Change | Rationale | Risk |
|---|---|---|---|
| 1 | **Sticky progress indicator** on all questionnaire steps | Users currently have no idea how much is left across 41 questions | None |
| 2 | **Chunk NMP-Q into 4 groups of 5** | A 20-item wall of radio buttons is the biggest drop-off risk | Adds 3 extra taps; net positive |
| 3 | **Anchor labels on the Likert row** ("Sangat tidak setuju" / "Sangat setuju") | Bare `1…7` forces users to scroll back to the legend | None |
| 4 | **Inline per-question validation** + scroll-to-first-unanswered | Current single bottom error line doesn't say *which* question is missing | None |
| 5 | **Draft autosave to `localStorage`** | 15 minutes is long enough to lose to a phone call or a dead battery | Must clear on successful submit; must not store anything after submit |
| 6 | **Show the numeric score** alongside the category on the result screen | The backend already returns `nmpq_score`, `dass_depression_score`, `dass_anxiety_score` — they're currently discarded by the frontend. Enables the `CountUp` animation. | ⚠️ **Requires researcher approval** — showing raw scores to respondents is a study-design decision, not a UI decision. Ask Sherin before shipping. |
| 7 | **Answered-state on question cards** | Makes "what did I miss" scannable | None |
| 8 | **Turn the 3s submit delay into a designed interstitial** | The wait already exists; make it feel intentional | None |

---

## 9. HARD CONSTRAINTS — do not change

These are non-negotiable. Violating any of them invalidates the research data.

**9.1 Instrument integrity**
- NMP-Q: exactly **20 items**, in the exact order in `src/data.js`, response values **1–7**.
- DASS-21 Depression: exactly **7 items**, exact order, submitted values **1–4**.
- DASS-21 Anxiety: exactly **7 items**, exact order, submitted values **1–4**.
- **Item wording is verbatim.** No shortening, no rephrasing, no "friendlier" rewrites, no emoji.
- Scale labels are verbatim.

**9.2 The DASS display/value offset — read this carefully**

The DASS scales are **displayed to the user as 0, 1, 2, 3** but **submitted to the server as 1, 2, 3, 4**. In the current code this is `x-text="entry.value - 1"` on display while `entry.value` is what gets sent (`public/index.html:312`, `public/app.js`). The Worker validates `1 ≤ v ≤ 4` (`src/index.js:63`).

Any reimplementation must preserve this offset exactly. Getting it wrong silently shifts every DASS score by 7 points and pushes respondents into the wrong severity category.

**9.3 Scoring thresholds** (owned by `src/data.js`, do not duplicate in UI code)

| Instrument | none/normal | mild | moderate | severe | extremely severe |
|---|---|---|---|---|---|
| NMP-Q (20–140) | 20 | 21–59 | 60–99 | 100–140 | — |
| DASS Depression (7–28) | 0–9 | 10–13 | 14–20 | 21–27 | 28 |
| DASS Anxiety (7–28) | 0–7 | 8–9 | 10–14 | 15–19 | 20–28 |

**9.4 The disclaimer stays.** Full text, on the result screen, legible — not collapsed behind a "read more", not in 9px grey text. It is an ethical requirement, not fine print.

**9.5 Researcher contact details stay** on the result screen, unchanged.

---

## 10. API contract — frozen

The Worker (`src/index.js`) must not need any changes. The frontend must keep sending exactly this:

**`POST /submit`** — `multipart/form-data`

| Field | Values |
|---|---|
| `name` | free text, optional, ≤255 chars |
| `age_group` | `under18` \| `18plus` |
| `gender` | `perempuan` \| `laki-laki` |
| `cohort` | `2023` \| `2024` \| `2025` |
| `other_device` | `hanya_ponsel` \| `tablet` \| `laptop` \| `konsol_gim` \| `lainnya` |
| `phone_activity` | `akademik` \| `belanja` \| `komunikasi` \| `hiburan` |
| `daily_usage` | `kurang_4` \| `4_6` \| `lebih_6` |
| `screentime_image` | optional file, jpg/png only, ≤5 MB |
| `nmpq_answers[0]` … `[19]` | integer 1–7 |
| `dass_depression_answers[0]` … `[6]` | integer 1–4 |
| `dass_anxiety_answers[0]` … `[6]` | integer 1–4 |

**Response 200:**
```json
{
  "nmpq_score": 0, "nomophobia_category": "none|mild|moderate|severe",
  "dass_depression_score": 0, "dass_depression_category": "normal|mild|moderate|severe|extremely_severe",
  "dass_anxiety_score": 0, "dass_anxiety_category": "normal|mild|moderate|severe|extremely_severe"
}
```
**Response 422:** `{ "message": "...", "errors": { "field": ["..."] } }`

Other routes, untouched: `GET /export/xlsx?token=…`, `GET /screentime-image/:key`.

---

## 11. Acceptance criteria

- [ ] All 8 steps + infographic overlay implemented, same order, same navigation semantics (back preserves answers).
- [ ] All questionnaire copy byte-identical to `src/data.js`.
- [ ] DASS display-0-3 / submit-1-4 offset verified by inspecting an actual network request.
- [ ] A full submission produces the same D1 row and the same XLSX export as the current build. **Diff a before/after export as the parity test.**
- [ ] Optional screentime upload still works, still enforces jpg/png ≤5 MB, still lands in R2.
- [ ] Validation blocks progress on every step it blocks today, and now identifies the specific unanswered question.
- [ ] Progress indicator accurate on every step.
- [ ] Complete keyboard-only run-through possible, start to finish.
- [ ] `prefers-reduced-motion: reduce` removes all decorative motion.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.
- [ ] Verified on real iOS Safari and Android Chrome, 360px width minimum.
- [ ] Disclaimer and researcher contact present and legible on the result screen.
- [ ] Deploys with `npm run deploy` to Cloudflare Workers with no Worker code changes.

---

## Appendix A — Source of truth

| What | Where |
|---|---|
| Questionnaire items, scales, categories, thresholds | `src/data.js` |
| Current wizard logic | `public/app.js` |
| Current markup / all UI copy | `public/index.html` |
| Current design tokens, animations | `src/css/app.css` |
| API + scoring + export | `src/index.js` |
| Illustrations | `public/images/info/`, `public/images/edukasi/` |

## Appendix B — Existing assets to reuse

- `images/info/nomophobia-chained.png` — chained-to-phone illustration (info screen, point 1)
- `images/info/nomophobia-wifi-off.png` — disconnected Wi-Fi (info screen, point 2)
- `images/info/nomophobia-anxious-hug.png` — anxious person (info screen, point 3)
- `images/info/screentime-example-android.jpeg` — Android Digital Wellbeing example (biodata)
- `images/info/screentime-example-ios.jpeg` — iOS Screen Time example (biodata)
- `images/edukasi/kenali-nomophobia.jpg` — full infographic (overlay screen)

All three `info/` illustrations currently render with `mix-blend-mode: multiply` so they sit on the gradient without a white box. Preserve that.

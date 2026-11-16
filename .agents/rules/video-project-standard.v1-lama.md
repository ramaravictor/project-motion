# Aturan Standar Video Project (ChillDev × @ramarvctr_)

Aturan ini wajib untuk setiap video vertikal (`9:16`) baru di repo ini. Ini satu-satunya sumber aturan; `AGENTS.md` dan `projects/AGENTS.md` hanya symlink ke file ini, jadi **edit di sini saja**.

- **Alur Kerja Wajib (paling atas)**: urutan tahap dan titik berhenti. Wajib diikuti setiap membuat video baru.
- **Bagian 0–2 dan 4–5**: wajib untuk semua project.
- **Bagian 3**: aturan teknis kartu wajib. **Isi dan desain kartu bebas dan wajib baru tiap video** (lihat 3.2).
- Project lama yang dibuat sebelum aturan ini (misalnya `claude-code-peta`) masih memakai layout lama dan tidak wajib diubah.

---

## Alur Kerja Wajib: Bang Motion → HTML → VO → Render

Setiap video baru **wajib** dibuat lewat skill **Bang Motion** (`.agents/skills/skill-motion/SKILL.md`) dan melewati 3 tahap di bawah. **Berhenti di akhir Tahap 1 dan Tahap 2**, lalu tunggu jawaban user. Jangan lompat tahap, jangan render sebelum user memberi audio VO.

### Tahap 1 — Pilih style (BERHENTI, tunggu konfirmasi)
1. Baca `SKILL.md` Bang Motion, `references/anti-ppt.md`, dan referensi sesuai jenis video (`explainer.md` atau `opener-konsep.md`, plus `techniques.md` §7c untuk bahasa gerak).
2. Pahami topik, lalu tulis **draf narasi singkat per scene** (belum final).
3. Tawarkan **3 pilihan style** yang paling cocok dengan konten. Tiap pilihan wajib berisi:
   - nama style dan alasan cocok dengan topik;
   - bahasa gerak (cara kartu/elemen masuk, transisi antar-scene, gerak kamera di dalam kartu);
   - palet aksen dan tipografi kartu;
   - **contoh gambar visual**:
     - (a) gambar acuan dari galeri Bang Motion (`.agents/skills/skill-motion/docs/gallery/*.jpg`) yang paling mirip; dan
     - (b) **style frame 1080×1920 buatan sendiri** di layout ChillDev (header + kartu + headline + Rama), dibuat dari HTML kecil di `projects/<nama>/style-options/opsi-<x>.html` lalu dipotret:
       `node projects/_shared/scripts/still.mjs projects/<nama>/style-options/opsi-a.html 0 projects/<nama>/style-options/opsi-a.png`
4. Tampilkan ketiga gambar ke user dan minta user memilih (boleh gabungan). **Jangan lanjut sebelum user konfirmasi.**

### Tahap 2 — Bangun HTML + script VO (BERHENTI, tunggu audio)
1. Setelah style dikonfirmasi, salin `_template` dan bangun **seluruh** `index.html`: semua kartu (desain baru, lihat 3.2), motion sesuai style terpilih, SCENES, sub-state, SFX.
   Hapus `vo.mp3` dan `audio_envelope.json` demo bawaan template, lalu kosongkan envelope di `index.html` menjadi `/*ENV*/[]/*ENV*/` supaya preview tidak memakai suara demo.
2. Karena VO belum ada, `t0/t1` memakai **estimasi** dari script (± 2,5 kata per detik + jeda 0,4 detik antar-scene). Mulut Rama tertutup selama envelope kosong; itu normal di tahap ini.
3. Cek di panel: semua lolos **kecuali** "Envelope audio ter-inline" (baru terpenuhi di Tahap 3). Ambil style frame tiap scene untuk ditunjukkan ke user.
4. Tulis script VO untuk ElevenLabs di `projects/<nama>/vo-script.txt`:
   - satu paragraf per scene, dipisah satu baris kosong (supaya ada jeda yang terbaca `silencedetect`);
   - bahasa Gen-Z Jakarta (bagian 5.1), angka dan simbol ditulis seperti diucapkan (misal "sepuluh ribu", "garis miring");
   - di atasnya cantumkan: voice yang dipakai (samakan dengan video sebelumnya supaya konsisten), perkiraan durasi, dan jumlah scene.
5. **Jangan render.** Serahkan: path `index.html`, style frame per scene, dan isi script VO di chat agar bisa langsung disalin ke ElevenLabs. Lalu tunggu user memberi file audio.

### Tahap 3 — Pasang VO, sinkronkan, render
1. Simpan audio dari user sebagai `projects/<nama>/vo.mp3` (VO bersih, tanpa SFX).
2. Jalankan `node projects/_shared/scripts/envelope.mjs projects/<nama>`. Pakai titik tengah jeda yang dicetak sebagai `t0/t1` baru.
3. Sesuaikan ulang timing sub-state dan motion di tiap kartu supaya pas dengan kalimat VO yang sebenarnya.
4. Panel wajib **0 gagal**. Cek cepat `--seconds 3`, lalu render penuh dengan `render.mjs`.
5. Laporkan path MP4, durasi, dan screenshot akhir tiap scene.

### Pembagian wewenang Bang Motion vs aturan ini
- **Dari Bang Motion**: pilihan style, desain kartu dan isi visual, bahasa gerak, transisi antar-scene, teks hidup, uji anti-PPT.
- **Tetap dari aturan ini (menang kalau bentrok)**: kanvas dan latar krem bergrid, safe zone dan 4 zona, header, karakter Rama, panel cek, larangan CSS `transition`, `seekTo` deterministik, render lewat `render.mjs`.
- Bagian Bang Motion yang **tidak dipakai**: autoplay + loop tanpa panel, `?debug=1`/`?clean=1`, `export-frames.mjs`, rasio 16:9.
- Kartu per scene di Zona 2 diperbolehkan, tapi **pergantiannya tidak boleh sekadar fade** dari template. Transisi dibawa objek/kamera (whip, push-through, objek yang berlanjut ke scene berikutnya), dan elemen di dalam kartu masuk dengan gerak (stagger, mask reveal, angka menghitung naik). Semua lewat GSAP yang terikat ke `tl.seek(curT)`.

---

## 0. Struktur Folder & Memulai Project Baru

Setiap project berada langsung di `projects/<nama-project>/` (**flat**, tanpa subfolder `01-referensi/`, `02-mentah/`, `03-hasil/`):

```text
projects/
├── _shared/                     # Aset & script bersama lintas project
│   ├── brand/                   # logo-youtube.svg, logo-instagram.svg
│   ├── rama/                    # 4 pose, 6 mulut (v0–v5), 2 mata (blink/wink)
│   ├── sfx/                     # sfx_pop, sfx_whoosh, sfx_glitch, sfx_click, sfx_success
│   └── scripts/                 # envelope.mjs, render.mjs, still.mjs
├── _template/                   # Kerangka kosong: safe zone, header, karakter, lip-sync, panel cek, render (TANPA kartu konten)
│   ├── index.html
│   ├── vo.mp3
│   └── audio_envelope.json
└── <nama-project>/              # Satu folder rata per project
    ├── index.html               # Kanvas & timeline utama
    ├── vo.mp3                   # Voiceover bersih (tanpa SFX)
    ├── audio_envelope.json      # Envelope lip-sync 30fps
    ├── vo-script.txt            # Script VO untuk ElevenLabs (Tahap 2)
    ├── style-options/           # Style frame pilihan style (Tahap 1)
    ├── <nama-project>.mp4       # Hasil render final MP4
    └── assets/                  # (Opsional) Hanya kalau project punya aset lokal sendiri
```

Langkah teknis (dijalankan di dalam Alur Kerja Wajib di atas; langkah 2–3 dan 6 baru dilakukan di Tahap 3):
1. Salin template: `cp -R projects/_template projects/<nama-project>`
2. Taruh VO bersih (tanpa SFX) di `projects/<nama-project>/vo.mp3`.
3. Buat envelope lip-sync dan lihat jeda kalimat:
   `node projects/_shared/scripts/envelope.mjs projects/<nama-project>`
   Script ini mencetak durasi VO, kandidat batas scene dari jeda kalimat, membuat `audio_envelope.json`, lalu menanamnya ke `index.html` (di antara marker `/*ENV*/`).
4. Edit `projects/<nama-project>/index.html` di blok bertanda **`EDIT DI SINI`**: kartu ilustrasi (HTML + CSS), `SCENES`, `updateSubStates()`, dan `SFX`. Template sengaja hanya berisi satu kartu placeholder; **desain kartu baru dari topik video** dan hapus placeholder-nya (lihat 3.2).
5. Buka `index.html` di Chrome. Panel **Cek Aturan Video** di kanan harus menunjukkan **0 gagal** sebelum render. Tekan `G` untuk garis bantu safe zone.
6. Render: `node projects/_shared/scripts/render.mjs projects/<nama-project>` → `projects/<nama-project>/<nama-project>.mp4`. Pakai `--seconds 3` untuk cek cepat.

Aset bersama ada di `projects/_shared/`. Rujuk dengan path relatif `../_shared/...` dari `projects/<nama-project>/index.html`; jangan salin aset ke tiap project.

---

## 1. Kanvas, Resolusi, & Safe Zone (`1080 × 1920 px`)

1. **Dimensi & Frame Rate**: `1080 × 1920` px, **30 FPS**. Latar krem `--bg: #F4EFE8` dengan grid `48px × 48px`, garis `rgba(20, 22, 25, 0.035)`.

2. **Safe Zone (acuan: `projects/fullstack-explainer`)**:
   - Margin: **`top 180`, `left 80`, `right 130`, `bottom 450`** → area aman **`870 × 1290`** (`x 80–950`, `y 180–1470`).
   - Kanan lebih lebar karena kolom tombol like/comment/share platform. Bawah 450px adalah area caption, username, dan tombol audio platform.
   - Semua teks dan UI wajib di dalam `#safe`:
     ```css
     /* safe zone: top 180, left 80, right 130, bottom 450 */
     #safe { position: absolute; top: 180px; left: 80px; width: 870px; height: 1290px; }
     ```
   - Yang boleh keluar dari `#safe`: latar (grid, canvas 3D, scrim) dan figur karakter.
   - **Dilarang** ada teks, kartu, atau lencana di bawah `y = 1470` atau di kanan `x = 950`.

3. **Pembagian 4 Zona** (format Presenter Dinamis, default):
   | Zona | Elemen | Posisi (koordinat kanvas) |
   |---|---|---|
   | 1 — Header & progress bar | `.brand-header` (di `#safe`, `top: 0`) | `y 180 – 254` (74px) |
   | 2 — Panggung visual / kartu | `#top-card-container` (`top: 90px`) | `y 270 – 790` (520 × 870 basis) |
   | 3 — Headline & caption | `#headline-dock` (`top: 626px`) | `y 806 – 1026` (220 × 870) |
   | 4 — Karakter Presenter | `#character-stage` (di luar `#safe`, `bottom: 130px`) | `y 1050 – 1790` (basis 740px) |
   - **Skala & Posisi Karakter Bebas**: Ukuran dan posisi karakter Rama (presenter) bebas menyesuaikan kebutuhan adegan dan gaya video (misal: medium shot/zoom-in `1.15×–1.25×` saat hook/CTA agar lebih engage, atau mengecil `0.8×` / bergeser saat UI/kode butuh ruang panggung lebih luas). Transformasi diterapkan pada `#character-rig` secara deterministik via `curT`.
   - **Panggung Visual Dinamis (Anti-Proyektor Slide)**: Kartu bukan proyektor slide statis. Elemen di dalam kartu/visual bebas menggunakan kedalaman 3D, kamera zoom/pan lokal, ekspansi layer, dan transisi objek kontinu (*continuous motion*) agar tidak terasa seperti pergantian slide PPT.
   - Jarak antar-zona basis `16px`. Safe zone teks tetap dijaga (`x 80–950`, `y 180–1470`).
   - **Zona 3**:
     - `.headline-main`: `48px`, `font-weight: 800`, `line-height: 1.1`, `letter-spacing: -0.035em`, maks 2 baris, kata kunci pakai `<span class="highlight-orange">` (`#FF5500`).
     - `.genz-caption-pill`: `20px`, `font-weight: 600`, `line-height: 1.35`, latar `rgba(255,255,255,0.86)`, border `1.5px #DFD8CE`, `border-radius: 16px`, maks 3 baris.

4. **Format tanpa karakter** (gaya `fullstack-explainer`, misalnya latar canvas 3D): boleh, Zona 4 dipakai untuk visual. Safe zone, header, dan aturan teks tetap berlaku.

---

## 2. Header Branding (Wajib Konsisten)

Header ada di baris paling atas `#safe` (lebar `870px`):

1. **Kiri (`.brand-logo-badge`)**: logo YouTube (`_shared/brand/logo-youtube.svg`, wadah `56 × 42`), judul **`ChillDev`** (`Plus Jakarta Sans` `25px` `800` `#141619`), sub-judul **`@chilldevibe`** (`JetBrains Mono` `15px` `700` `#FF5500`).
2. **Kanan (`.header-right-group`)**: `#scene-tag-pill` (topik adegan tanpa nomor slide, contoh: `ANTIGRAVITY IDE` atau `21ST MCP`, latar `#FF5500`, teks putih `14px` mono, `white-space: nowrap`), lalu `.brand-handle` berisi logo Instagram (`_shared/brand/logo-instagram.svg`, `24 × 24`) + **`@ramarvctr_`**.
3. **Tanpa Nomor Slide / Segmented Progress Bar**: Dilarang memakai penomoran slide (`01 / ...`, `02 / ...`) dan progress bar kotak-kotak bertingkat di header karena menciptakan kesan presentasi PPT. Header dibuat bersih satu baris rapi.

---

## 3. Panggung Motion Graphic Dinamis (Bang Motion Standard)

### 3.1 Aturan umum animasi & visual

1. **Bebas dari Template Slide**: Panggung visual TIDAK lagi dibatasi oleh kotak kartu 520px kaku atau keharusan memakai `.win-bar` (3 titik). Seluruh area visual hidup sebagai **motion graphic sinematik penuh** sesuai skill Bang Motion.
2. **Kamera & Dunia Mengalir**: Menggunakan satu dunia mengalir (`#world` / canvas 3D) dengan kamera dinamis (`shot()`, zoom-in ke detail, push-through, parallax). Pergantian adegan TIDAK boleh sekadar fade section atau ganti kartu diam.
3. **Tipografi Hidup & Kinetik**: Teks masuk per kata/huruf dengan penekanan kata kunci (`.hl` dengan sapuan highlighter / pill), directional motion blur, dan hierarki tegas.
4. **Elemen UI Hidup (Live Assembly)**: Elemen UI bukan screenshot atau layout statis, melainkan dirakit hidup: kursor bergerak, kode terketik deterministik, tombol/tile meluncur dan mengunci magnetis (*pop & dock*), angka menghitung naik (*counter*).
5. **Dilarang CSS `transition`**: Semua animasi wajib digerakkan oleh GSAP yang terikat ke `curT` agar seek deterministik saat preview dan render per frame.
6. **Safe zone tetap dijaga**: Semua teks penting dan callout tetap berada di dalam safe zone (`x 80–950`, `y 180–1470`).

### 3.2 Anti-template: kartu didesain dari topik

Yang standar dan dipakai ulang di tiap video **hanya** kerangkanya: safe zone, header, karakter Rama, lip-sync, panel cek, dan render. **Kartu ilustrasi bukan bagian dari standar.**

1. **Dilarang menyalin kartu dari project lain** (termasuk `claude-code-peta`, `tes-aturan`, `vibe-ui-antikaku`) lalu cuma mengganti teksnya. Mengganti nama file, repo, atau angka di kartu lama tetap dihitung menyalin.
2. Bentuk kartu lahir dari isi VO: tanya "benda/layar apa yang paling menjelaskan kalimat ini?" (misal UI berubah dari kaku ke rapi, terminal perintah MCP, hasil pencarian komponen, grafik biaya token). Jangan memaksakan topik ke bentuk lama: tumpukan file error hanya kalau VO memang soal kode saling terkait, graf hanya kalau alatnya memang menghasilkan graf, profil GitHub hanya kalau repo dibahas.
3. **Alur cerita juga tidak diwarisi.** Jumlah scene, urutan, dan CTA mengikuti VO. Jangan default ke pola hook → error → repo → graf → CTA.
4. Kalau menampilkan repo/produk nyata, angka (star, fork, harga, versi) wajib sesuai sumber aslinya.
5. Panel cek gagal kalau placeholder masih ada atau kartu memakai struktur kartu lama (`.spag-grid`, `.gh-card`, `.graph-area`, `.c1-chat`, `.cmt-panel`, dll.). Jangan mengakali dengan sekadar mengganti nama kelas; buat desain baru.

---

## 4. Karakter 3D Rama Berbicara

1. **Konsistensi wajah & pakaian (harga mati)**:
   - Wajah: mata sedikit sipit, **kumis tipis rapi**, kacamata bingkai hitam tebal, rambut hitam belah tengah agak bergelombang.
   - Pakaian: selalu **jersey putih Real Madrid** (Adidas di kanan dada, crest di kiri, *Emirates FLY BETTER*, strip bahu emas/hitam). Dilarang ganti baju di tengah video.

> **Acuan implementasi: `projects/_template/index.html`.** Rumus di bawah identik dengan kode itu (diturunkan dari `claude-code-peta`).

2. **Struktur rig (`#character-rig`)**:
   - `740 × 740`, `transform-origin: bottom center`, `will-change: transform`, `contain: layout paint`, base identity transform.
   - Bagian bawah dipudarkan supaya badan tidak terpotong lurus: `mask-image: linear-gradient(to bottom, #000 78%, transparent 100%)` (plus versi `-webkit-`).
   - Layer (`position: absolute; inset: 0; object-fit: contain;`): 4 pose `.char-pose` (`z-index: 1`, `drop-shadow(0 20px 45px rgba(0,0,0,0.14))`), 6 mulut `.char-viseme` (`z-index: 3`), 2 mata `.char-eye-overlay` (`z-index: 3`).
   - Tampil/sembunyi hanya lewat kelas `.active` (`opacity`/`visibility`), tanpa transition.
   - `.char-ground-shadow`: `bottom: 20px`, `500 × 44`, `radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)`.

3. **4 pose** (`_shared/rama/`, PNG `1024 × 1024`, kepala sejajar), dipilih per scene lewat field `pose` di `SCENES`:
   - `present` (`rama_pose_presenting.png`): penjelasan umum, default.
   - `shocked` (`rama_pose_shocked.png`): bug, error, spaghetti code, halu, boncos token.
   - `point` (`rama_pose_point_up.png`): memperkenalkan repo, fitur utama, perintah terminal.
   - `thumbs` (`rama_pose_thumbsup.png`): hasil positif, efisiensi, CTA.

4. **Lip-sync 6 viseme** (`mouth_v0_closed` … `mouth_v5_shock`):
   ```js
   const frameIdx = Math.min(AUDIO_ENV.length - 1, Math.max(0, Math.floor(curT * 30)));
   const vol = AUDIO_ENV[frameIdx] || 0;

   const SYLLABLE_PATTERN = ['v3', 'v4', 'v1', 'v3', 'v2', 'v4', 'v0', 'v3', 'v1', 'v4', 'v2', 'v3'];
   function computeVisemeForFrame(frameIdx, vol, poseKey) {
     if (vol < 0.14) return 'v0';                           // jeda: mulut tertutup
     const step = Math.floor(frameIdx / 2);                 // ganti suku kata tiap 2 frame (15Hz)
     if (vol < 0.32) return (step % 2 === 0) ? 'v2' : 'v1'; // suara pelan
     const patViseme = SYLLABLE_PATTERN[step % SYLLABLE_PATTERN.length];
     if (poseKey === 'shocked' && patViseme === 'v4' && vol > 0.72) return 'v5'; // menganga kaget
     return patViseme;
   }
   ```

5. **Kedip & wink** (`eye_blink_both.png`, `eye_wink_right.png`):
   ```js
   const isWinking  = (curT >= DURATION - 5.5 && curT <= DURATION - 4.4);
   const blinkMod   = (curT + 1.2) % 3.4;
   const isBlinking = !isWinking && (blinkMod >= 0 && blinkMod < 0.13);
   ```
   Hanya satu overlay mata yang aktif dalam satu frame.

6. **Gerak tubuh** (wajib persis, dihitung tiap frame di `seekTimeline(curT)`):
   ```js
   const dtSwitch  = Math.max(0, curT - poseSwitchTime);
   const switchPop = dtSwitch < 0.25 ? Math.sin((dtSwitch / 0.25) * Math.PI) * 0.025 : 0;
   const talkBobY    = vol > 0.15 ? -Math.abs(Math.sin(curT * 18)) * (2.0 + vol * 3.5) : 0;
   const breatheY    = Math.sin(curT * 2.8) * 2.5;
   const subtleTilt  = Math.sin(curT * 2.2) * (0.6 + vol * 0.8);
   const subtleSwayX = Math.sin(curT * 1.6) * 2.5;
   charRig.style.transform = 'translate(' + subtleSwayX.toFixed(2) + 'px, ' + (breatheY + talkBobY).toFixed(2) + 'px) rotate('
     + subtleTilt.toFixed(2) + 'deg) scale(' + (1 + switchPop + vol * 0.008).toFixed(4) + ')';
   ```
   `poseSwitchTime` wajib deterministik: `t0` dari scene terakhir (sampai scene aktif) yang posenya beda dari scene sebelumnya; scene pertama `-10`. Jangan simpan sebagai variabel yang berubah saat `seekTo()` dipanggil.

---

## 5. Narasi, Voiceover, & Render

1. **Gaya bahasa**: Gen-Z Jakarta yang natural untuk developer (*"Ngaku!", "vibe coding", "rungkad berjamaah", "buta konteks", "halu parah", "boncos token", "no debat"*). Sebut **Antigravity IDE** dan nama repo/alat yang dibahas di narasi, headline, dan kartu kalau topiknya relevan dengan tools/IDE AI.

2. **VO & envelope lip-sync**:
   - Satu file VO bersih (`vo.mp3`) per project. Batas scene (`t0`/`t1`) diambil dari jeda kalimat `silencedetect=noise=-32dB:d=0.22` (dicetak oleh `envelope.mjs`); pakai titik tengah jeda.
   - Envelope dibuat dari PCM `44.1kHz s16le mono` VO **sebelum** dicampur SFX, 30fps, dengan rumus **`vol = min(1, 2.265 × RMS^0.78)`**. Rumus ini sama dengan envelope `claude-code-peta`, sehingga ambang viseme `0.14 / 0.32 / 0.72` berperilaku sama. Jangan pakai normalisasi lain.
   - Kalau VO diganti, jalankan ulang `envelope.mjs`.

3. **SFX**: didefinisikan di array `SFX` (`{ t, file, vol }`) dan diekspos lewat `window.OPENER.SFX`; `render.mjs` mencampurnya ke VO. File dari `_shared/sfx/` (`sfx_pop`, `sfx_whoosh`, `sfx_glitch`, `sfx_click`, `sfx_success`), volume `0.14–0.16`.

4. **Kontrak deterministik & render**:
   - `index.html` wajib menyediakan `window.seekTo(sec)` dan `window.OPENER = { ready: true, DURATION, FPS, WIDTH, HEIGHT, SCENES, SFX, seek }`.
   - Kartu, headline, progress bar, sub-state, pose, viseme, mata, dan transformasi tubuh harus sepenuhnya ditentukan oleh `curT`.
   - Mode render: `index.html?render=1` (panel cek dan garis bantu disembunyikan, skala 1:1).
   - Render dengan `projects/_shared/scripts/render.mjs` (Puppeteer → PNG per frame → `ffmpeg libx264 -crf 18 -r 30`, audio AAC 192k).

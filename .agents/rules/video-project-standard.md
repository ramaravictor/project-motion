# Aturan Standar Video Project (ChillDev × @ramarvctr_) — v2

Aturan ini wajib untuk setiap video vertikal (`9:16`) baru di repo ini. Ini satu-satunya sumber aturan; `AGENTS.md` dan `projects/AGENTS.md` hanya symlink ke file ini, jadi **edit di sini saja**.

- **v2 (16 Nov 2026)**: format kartu + Rama besar diganti dengan **motion graphic penuh bergaya Bang Motion** + **Rama voxel kecil** yang pindah posisi per scene. Contoh frame: `projects/_shared/format-baru/contoh-1..4.png`.
- Aturan lama (v1, kartu Zona 2 + headline Zona 3 + Rama PNG 740px) disimpan di `.agents/rules/video-project-standard.v1-lama.md`. Project lama tidak wajib diubah.
- **Template v2**: `projects/_template/index.html` sudah v2 (header ramping, Rama voxel per scene, lip-sync, panel **Cek Aturan Video v2**). Template v1 disimpan di `.agents/rules/template-v1-lama.html`. Panel cek: `node projects/_shared/scripts/check.mjs projects/<nama> [--tahap2]`.

---

## Alur Kerja Wajib: Bang Motion → HTML → VO → Render

Setiap video baru dibuat lewat skill **Bang Motion** (`.agents/skills/skill-motion/SKILL.md`) dan melewati 3 tahap. **Berhenti di akhir Tahap 1 dan Tahap 2**, lalu tunggu jawaban user. Jangan render sebelum user memberi audio VO.

### Tahap 1 — Pilih style (BERHENTI, tunggu konfirmasi)
1. Baca `SKILL.md`, `references/anti-ppt.md`, `references/techniques.md` §7c–7e, dan referensi sesuai jenis video (`explainer.md`, `opener-konsep.md`, atau `kartun-panggung.md`).
2. Pahami topik, tulis **draf narasi singkat per scene**.
3. Tawarkan **3 pilihan style** dari menu di bagian 3. Tiap pilihan wajib berisi:
   - nama arah gaya Bang Motion (baris tabel "Arah gaya" atau gaya explainer 1–6) dan alasan cocok dengan topik;
   - **style brief** ringkas sesuai Hukum #3 Bang Motion: palet (hex + sumber), font display + pendamping, bahasa gerak latar (§7c), permukaan latar (§7d), gaya render objek (§7e), tanda tangan gerak, transisi antar-scene, satu momen istimewa;
   - rencana posisi Rama per scene (bagian 4);
   - **contoh visual**: (a) gambar galeri Bang Motion yang paling mirip (`.agents/skills/skill-motion/docs/gallery/*.jpg`) dan/atau contoh gaya di kerangka v2 (`projects/_shared/format-baru/gaya/gaya-<n>.png`, lihat 3.1), dan (b) **style frame 1080×1920 buatan sendiri** di `projects/<nama>/style-options/opsi-<x>.html`, dipotret dengan
     `node projects/_shared/scripts/still.mjs projects/<nama>/style-options/opsi-a.html 0 projects/<nama>/style-options/opsi-a.png`
4. Tampilkan ketiganya dan minta user memilih (boleh gabungan). **Jangan lanjut sebelum user konfirmasi.**

### Tahap 2 — Bangun HTML + script VO (BERHENTI, tunggu audio)
1. Bangun `projects/<nama>/index.html`: dunia/panggung visual sesuai style terpilih, SCENES, Rama voxel, SFX. Mulai dari starter Bang Motion yang sesuai gayanya (`assets/starter-*.html`) untuk arsitektur, lalu terapkan kontrak bagian 6 (kanvas, `seekTo`, `window.OPENER`, Rama, lip-sync).
2. Karena VO belum ada, `t0/t1` memakai **estimasi** (± 2,5 kata per detik + jeda 0,4 detik antar-scene). Envelope dikosongkan (`/*ENV*/[]/*ENV*/`), mulut Rama tertutup. Itu normal.
3. Ambil style frame tiap scene untuk ditunjukkan ke user, dan jalankan cek manual bagian 7 (kecuali envelope).
4. Tulis `projects/<nama>/vo-script.txt` untuk ElevenLabs:
   - satu paragraf per scene, dipisah satu baris kosong;
   - bahasa sesuai jenis konten (bagian 5.1), angka dan simbol ditulis seperti diucapkan;
   - di atasnya cantumkan voice (samakan dengan video sebelumnya di seri yang sama), perkiraan durasi, jumlah scene, dan cara baca istilah.
5. **Jangan render.** Serahkan path `index.html`, style frame per scene, dan isi script VO di chat. Tunggu file audio dari user.

### Tahap 3 — Pasang VO, sinkronkan, render
1. Simpan audio sebagai `projects/<nama>/vo.mp3` (VO bersih, tanpa SFX). File mentah ElevenLabs tidak disimpan di repo setelah dipindah jadi `vo.mp3`.
2. Jalankan `node projects/_shared/scripts/envelope.mjs projects/<nama>`. Pakai titik tengah jeda yang dicetak sebagai `t0/t1` baru.
3. Sesuaikan timing beat visual, posisi Rama, dan SFX dengan kalimat VO sebenarnya.
4. Cek manual bagian 7 harus lolos semua. Cek cepat `--seconds 3`, lalu render penuh dengan `render.mjs`.
5. Hapus folder sisa cek (`frames/`, screenshot sementara) setelah MP4 final jadi.
6. Laporkan path MP4, durasi, dan screenshot akhir tiap scene.

### Pembagian wewenang Bang Motion vs aturan ini
- **Dari Bang Motion**: arah gaya, style brief, desain dunia/panggung, bahasa gerak, transisi, tipografi hidup, uji anti-PPT (8 larangan struktural), determinisme.
- **Tetap dari aturan ini (menang kalau bentrok)**: kanvas 9:16 + safe zone, header ramping, Rama voxel + lip-sync, larangan CSS `transition`, kontrak `seekTo`/`window.OPENER`, render lewat `render.mjs`, alur 3 tahap.
- Bagian Bang Motion yang **tidak dipakai**: autoplay + loop tanpa kontrol, `?debug=1`/`?clean=1`, `scripts/export-frames.mjs`, rasio 16:9/1:1, default "tanpa suara".

---

## 0. Struktur Folder

```text
projects/
├── _shared/
│   ├── brand/                # logo-youtube.svg, logo-instagram.svg, profile-pic/, banner/
│   ├── rama/                 # PNG Rama v1 (project lama) + voxel/ (karakter v2)
│   ├── format-baru/          # contoh frame format v2
│   ├── sfx/                  # sfx_pop, sfx_whoosh, sfx_glitch, sfx_click, sfx_success
│   └── scripts/              # envelope.mjs, render.mjs, still.mjs, check.mjs
├── _template/                # v2: salin dengan cp -R projects/_template projects/<nama>
└── <nama-project>/           # satu folder per video; seri boleh part-1/, part-2/ …
    ├── index.html
    ├── vo.mp3
    ├── audio_envelope.json
    ├── vo-script.txt
    ├── style-options/        # style frame Tahap 1 (disimpan sebagai catatan keputusan)
    ├── <nama-project>.mp4
    └── assets/               # opsional, aset lokal project
```

Aset bersama dirujuk dengan path relatif `../_shared/...` (atau `../../_shared/...` dari folder part). Jangan salin aset ke tiap project.

---

## 1. Kanvas & Safe Zone (`1080 × 1920`, 30 FPS)

1. **Dimensi**: `1080 × 1920` px, **30 FPS**.
2. **Safe zone**: margin **`top 180`, `left 80`, `right 130`, `bottom 450`** → area aman `870 × 1290` (`x 80–950`, `y 180–1470`).
   - Kanan lebih lebar karena kolom tombol platform; bawah 450px untuk caption, username, dan tombol audio platform.
   - Semua **teks dan UI penting** wajib di dalam `#safe`:
     ```css
     #safe { position: absolute; top: 180px; left: 80px; width: 870px; height: 1290px; }
     ```
   - Boleh keluar dari safe zone: latar, dunia/panggung visual (bentuk, cahaya, objek dekoratif tanpa teks), dan **figur Rama**.
   - Dilarang ada teks, angka penting, atau lencana di bawah `y = 1470` atau di kanan `x = 950`.
3. **Tidak ada zona tetap.** Pembagian Zona 2 (kartu) / Zona 3 (headline dock) / Zona 4 (karakter 740px) dari v1 **dihapus**. Tata letak tiap scene lahir dari style dan isi VO. Yang dijaga hanya: header di baris atas `#safe`, teks di dalam safe zone, dan Rama tidak menutupi teks atau objek yang sedang dijelaskan.
4. **Latar tidak dikunci.** Latar krem bergrid v1 bukan default lagi. Latar mengikuti arah gaya, tidak boleh flat satu warna diam (Bang Motion Hukum #3 poin 5), dan boleh berganti warna dengan pemicu yang terlihat.

---

## 2. Header Ramping (wajib konsisten)

Satu baris di atas `#safe` (`top: 0`, tinggi ± 56px):

1. **Kiri — pill topik**: topik scene/seri tanpa nomor slide (contoh: `CONTEXT7 MCP`, `● PIALA ASIA FUTSAL`, `SRIWIJAYA FC · PART 4`). `JetBrains Mono` 22–26px 800, `white-space: nowrap`. **Warna pill mengikuti palet style** (tidak wajib `#FF5500`).
2. **Kanan — handle**: logo Instagram (`_shared/brand/logo-instagram.svg`, 24–28px) + **`ChillDev`** (Plus Jakarta Sans 800) + **`@ramarvctr_`** (JetBrains Mono 700), dalam pill tipis semi-transparan yang kontras dengan latar.
3. Dilarang nomor slide (`01 / …`) dan progress bar bersegmen.
4. Header boleh masuk dengan gerak di awal video, lalu diam; tidak ikut transisi scene.
5. Nama channel bisa berubah (calon: DEV UNITED). Kalau berubah, ganti teks `ChillDev` di sini dan di semua template sekaligus.

---

## 3. Style Visual dari Bang Motion

### 3.1 Menu gaya
Pilih dari dua daftar Bang Motion; boleh memadukan dua dengan sadar.

**Contoh gaya di kerangka v2**: `projects/_shared/format-baru/gaya/gaya-board.png` (papan), `gaya-<n>.png` + `gaya-<n>.mp4` (4 detik). Sumber `format-baru/gaya.html?v=<n>`, ekspor ulang `node projects/_shared/format-baru/export-gaya.mjs [n]`.

| n | Gaya | Latar bergerak | Teks masuk |
|---|---|---|---|
| 1 | Sinematik gelap | nebula + partikel menembus kamera | push-through dari besar & buram |
| 2 | Poster color-block | bidang warna menyapu tiap ketukan | kotak teks menabrak dari tepi |
| 3 | Editorial terang | garis & lingkaran menggambar sendiri | naik pelan, serif |
| 4 | Kertas & cetak | kertas sobek terbang lalu mendarat, stempel | kata jatuh miring, tulisan tangan |
| 5 | Retro / analog | matahari bergaris, grid, scanline, pita VHS | muncul patah-patah, chromatic |
| 6 | Brutalis mono | grid keras, blok lompat antar-sel, terminal | diketik per kata, kursor |
| 7 | Grainy gradient | bentuk bercahaya berputar, butiran hidup | naik dari buram |
| 8 | Kartun panggung (explainer 6) | langit, awan, server berkedip, paket data | kata membesar kenyal |

Contoh ini **acuan arah, bukan kulit yang disalin**: palet, font, dan dunia tiap video tetap lahir dari topiknya (3.3 poin 4, 3.4). Teks dan angka di contoh hanya isian. Pastel ceria, Mewah gelap, dan Flat pop berfoto belum punya contoh.

**Arah gaya** (`SKILL.md` tabel "Arah gaya"): Sinematik gelap · Poster color-block · Editorial terang · Kertas & cetak · Retro/analog · Brutalis mono · Pastel ceria · Mewah gelap · Flat pop berfoto · Grainy gradient.

**Gaya explainer** (`references/explainer.md`): 1 Kartun kolase · 2 Jurnalisme visual · 3 Katalog putih · 4 Sketsa vintage · 5 Aksi kontinu · 6 Kartun panggung.

### 3.2 Arahan per jenis konten channel
Ini titik awal, bukan kunci. Tiga opsi Tahap 1 boleh dari luar tabel bila alasannya kuat.

| Jenis konten | Kandidat utama | Contoh |
|---|---|---|
| Dev / AI tools / keamanan | Brutalis mono, Sinematik gelap, Grainy gradient, Flat pop berfoto | `format-baru/contoh-1.png` (editor 3D miring) |
| Bola: berita, skor, drama federasi | Poster color-block, Jurnalisme visual (2), Aksi kontinu (5) | `format-baru/contoh-2.png` (siaran TV), futsal-ffi-pssi |
| Bola: kisah / sejarah klub | Sketsa vintage (4), Mewah gelap, Retro/analog | `format-baru/contoh-3.png` (stadion malam), sriwijaya-fc-kisah |
| Edukasi konsep (backend, jaringan, cara kerja) | Kartun panggung (6), Aksi kontinu (5), Kartun kolase (1) | — |
| CTA / penutup | Mengikuti style video; boleh pindah ke medan warna brand oranye `#FF5500` dengan pemicu terlihat | `format-baru/contoh-4.png` |

### 3.3 Hukum yang wajib (dari Bang Motion)
1. **Anti-PPT**: lolos 8 larangan struktural `SKILL.md` (tanpa section yang di-fade, ada benang merah visual, maks. 2 tingkat teks per adegan, tanpa Ken Burns sebagai satu-satunya gerak, transisi bukan cuma fade, mulai dari starter gayanya, bukan miniatur, bukan kerangka template).
2. **Deterministik**: semua visual fungsi murni dari waktu timeline. Tanpa `Math.random()`, `Date.now()`, `performance.now()` di logika visual, dan tanpa akumulasi per frame.
3. **Teks hidup, latar tunduk**: sentence case 500–600 sebagai default, kantong teks gelap (≤ 25 % luminance) atau terang (≥ 80 %), dua scene berturut-turut beda ukuran/arah masuk/posisi teks.
4. **Kebaruan**: video baru berbeda dari video sebelumnya di minimal 3 dari 4 (palet, font, bahasa latar, tanda tangan gerak). **Seri** (part-1, part-2, …) boleh dan sebaiknya memakai style yang sama antar part.
5. **Entitas yang disebut wajib tampil**: tool, repo, klub, pemain, atau angka yang disebut VO muncul di layar saat disebut.
6. **Fakta**: angka (skor, star GitHub, harga, versi, tanggal, nominal) wajib sesuai sumber asli. Data contoh/isian tidak boleh masuk video final.

### 3.4 Anti-salin
Dilarang menyalin dunia/panggung dari project lain lalu mengganti teksnya. Yang boleh dipakai ulang hanya kerangka di aturan ini (header, Rama, lip-sync, kontrak render) dan isi `_shared/`.

---

## 4. Karakter Rama Voxel (v2)

Sumber: komponen `projects/_shared/rama/voxel/rama-voxel.js` (Three.js r128, kotak bergaris tepi hitam). Pratinjau: `voxel.html` (`?pose=...`). Pakai: `const rv = RamaVoxel.create(ukuran); rv.render({ t, vol, viseme, blink, pose, fromPose, k, look })`. PNG 3D Rama di `_shared/rama/*.png` hanya untuk project v1 dan thumbnail.

1. **Ciri wajib (harga mati)**: rambut hitam, kacamata bingkai hitam tebal, alis tebal, kumis tipis, kulit sawo terang, **jersey putih** dengan strip bahu emas, kerah navy, lencana emas di dada kiri. Tidak berganti baju di tengah video.
2. **Ukuran**: default **300–440px**; CTA atau momen penekanan boleh sampai **580px**.
3. **Posisi per scene** (field di `SCENES`): `kiri bawah`, `kanan bawah`, `tengah bawah`, atau `sembunyi`. Kepala dan badan menoleh ke arah objek yang sedang dijelaskan (rotasi Y ± 0,35 rad).
   - Rama boleh di luar safe zone, tetapi tidak boleh menutupi teks atau objek utama scene.
   - Perpindahan posisi wajib bergerak (meluncur, lompat, keluar-masuk frame) lewat GSAP, bukan teleport atau fade.
   - Video cerita sendu boleh menyembunyikan Rama di sebagian besar scene.
4. **Pose** (field `pose` di `SCENES`): `present` (penjelasan umum), `point` (fitur, angka, fakta), `thumbs` (hasil bagus, CTA), `shocked` (drama, bug, kejutan; alis naik, mulut bisa `v5`). Pergantian pose wajib transisi ± 0,3 detik lewat `fromPose` + `k` (ease-out), dihitung dari `curT`, bukan langsung ganti.
5. **Lip-sync** (dipertahankan dari v1, wajib persis):
   ```js
   const frameIdx = Math.min(AUDIO_ENV.length - 1, Math.max(0, Math.floor(curT * 30)));
   const vol = AUDIO_ENV[frameIdx] || 0;
   const SYLLABLE_PATTERN = ['v3', 'v4', 'v1', 'v3', 'v2', 'v4', 'v0', 'v3', 'v1', 'v4', 'v2', 'v3'];
   function computeVisemeForFrame(frameIdx, vol, poseKey) {
     if (vol < 0.14) return 'v0';
     const step = Math.floor(frameIdx / 2);
     if (vol < 0.32) return (step % 2 === 0) ? 'v2' : 'v1';
     const patViseme = SYLLABLE_PATTERN[step % SYLLABLE_PATTERN.length];
     if (poseKey === 'shocked' && patViseme === 'v4' && vol > 0.72) return 'v5';
     return patViseme;
   }
   ```
   Ukuran mulut balok per viseme (`[lebar, tinggi]`): `v0 [20,2.5]`, `v1 [22,7]`, `v2 [11,8]`, `v3 [15,12]`, `v4 [21,15]`, `v5 [15,21]` → `mouth.scale.set(w / 18, Math.max(0.3, h / 6), 1)`.
6. **Kedip**: `((curT + 1.2) % 3.4) < 0.13` → mata balok `scale.y = 0.3`.
7. **Gerak tubuh** (dihitung tiap frame dari `curT`, tanpa state):
   - kepala: `rotation.y = arahPandang + sin(t·1.4)·0.12`, `rotation.z = sin(t·2.2)·0.04·(1+vol)`, `rotation.x = vol > 0.15 ? −|sin(t·18)|·0.06·vol : 0`;
   - badan: `rotation.y = arahPandang·0.35`;
   - wadah: napas `translateY = sin(t·2.8)·2.5px` + mantul bicara seperti v1.
8. Render Three.js memakai `preserveDrawingBuffer: true` dan dipanggil di dalam `seekTo()` (tanpa loop `requestAnimationFrame` sendiri saat `?render=1`).

---

## 5. Narasi, Voiceover, SFX

1. **Gaya bahasa**:
   - Dev/AI: Gen-Z Jakarta natural (*"Ngaku!", "vibe coding", "rungkad berjamaah", "halu parah", "boncos token"*). Sebut **Antigravity IDE** dan nama tool/repo bila relevan.
   - Bola berita/drama: gaya komentator santai.
   - Bola kisah: pelan, bercerita, tanpa slang berlebihan.
   - CTA: "Ketik `<KATA>` di kolom komentar" + "Gas!" untuk konten dev; konten cerita boleh tanpa kata kunci.
2. **VO & envelope**: satu `vo.mp3` bersih per video/part. Batas scene dari `silencedetect=noise=-32dB:d=0.22` (dicetak `envelope.mjs`), pakai titik tengah jeda. Envelope 30fps dari PCM 44.1kHz s16le mono VO sebelum SFX, **`vol = min(1, 2.265 × RMS^0.78)`**. Jalankan ulang `envelope.mjs` setiap VO diganti.
3. **SFX**: array `SFX` (`{ t, file, vol }`) diekspos lewat `window.OPENER.SFX`, dicampur oleh `render.mjs`. File dari `_shared/sfx/`, volume `0.14–0.16`. Musik latar boleh (`assets/bgm.*`) bila style memintanya, volume jauh di bawah VO.

---

## 6. Kontrak Deterministik & Render

1. `index.html` wajib menyediakan `window.seekTo(sec)` dan `window.OPENER = { ready: true, DURATION, FPS, WIDTH, HEIGHT, SCENES, SFX, seek }`.
2. Dunia visual, teks, header, posisi/arah Rama, viseme, kedip, dan gerak tubuh sepenuhnya ditentukan oleh `curT`. Satu timeline GSAP, di-`seek(curT)`.
3. **Dilarang CSS `transition`** dan animasi CSS `@keyframes` untuk state yang terlihat; semua lewat GSAP/fungsi waktu.
4. Mode render: `index.html?render=1` (kontrol dan garis bantu disembunyikan, skala 1:1). Mode preview boleh punya kontrol play/scrub kecil di luar kanvas.
5. Render: `node projects/_shared/scripts/render.mjs projects/<nama>` (Puppeteer → PNG per frame → `ffmpeg libx264 -crf 18 -r 30`, audio AAC 192k). Cek cepat dengan `--seconds 3`. Halaman ber-WebGL dirender dengan flag `--use-angle=swiftshader --enable-unsafe-swiftshader` bila GPU headless gagal.

---

## 7. Cek Sebelum Render

Panel **Cek Aturan Video v2** (di `index.html` atau lewat `check.mjs`) wajib **0 gagal** sebelum render penuh. Di Tahap 2 pakai `--tahap2` (envelope belum ada). Butir yang tidak bisa dicek otomatis (anti-PPT, style brief, fakta) tetap dicek manual. Semua harus "ya":

- [ ] Kanvas 1080 × 1920, `#safe` = x80 y180 870×1290.
- [ ] Semua teks/angka/lencana di dalam `x 80–950`, `y 180–1470` di setiap scene (cek screenshot akhir tiap scene dengan garis bantu).
- [ ] Header ramping lengkap: pill topik (nowrap, tidak terpotong) + `ChillDev` + `@ramarvctr_`; tanpa nomor slide/progress bar.
- [ ] Lolos 8 larangan struktural anti-PPT Bang Motion.
- [ ] Style brief tertulis di `style-options/` dan berbeda dari video non-seri sebelumnya (3 dari 4).
- [ ] Rama voxel: ciri wajib lengkap, ukuran sesuai, tidak menutupi teks/objek utama, perpindahan posisi bergerak.
- [ ] `seekTo()` deterministik: screenshot di detik yang sama setelah seek acak identik.
- [ ] Tidak ada CSS `transition`/`@keyframes` pada state.
- [ ] Envelope ter-inline (Tahap 3) dan mulut memakai ≥ 5 viseme.
- [ ] Angka dan nama sesuai sumber; tidak ada data isian.
- [ ] Tidak ada error di console saat `?render=1`.

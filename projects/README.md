# Struktur Folder `projects/`

Setiap project video berada langsung di `projects/<nama-project>/` secara **rata (flat)** tanpa subfolder `01-referensi/`, `02-mentah/`, atau `03-hasil/`:

```text
projects/
├── AGENTS.md                    # Symlink ke .agents/rules/video-project-standard.md
├── README.md                    # Dokumentasi struktur folder
├── TODO.md                      # Antrean produksi 5 ide konten berikutnya
├── _shared/                     # Aset & script bersama lintas project
│   ├── brand/                   # logo-youtube.svg, logo-instagram.svg
│   ├── rama/                    # 4 pose, 6 mulut (v0–v5), 2 mata (blink/wink)
│   ├── sfx/                     # sfx_pop, sfx_whoosh, sfx_glitch, sfx_click, sfx_success
│   └── scripts/                 # envelope.mjs, render.mjs
├── _template/                   # Template starter project baru
│   ├── index.html
│   ├── vo.mp3
│   └── audio_envelope.json
└── <nama-project>/              # Satu folder rata per project
    ├── index.html               # Kanvas & timeline utama
    ├── vo.mp3                   # Voiceover bersih (bila ada)
    ├── audio_envelope.json      # Envelope lip-sync 30fps (bila pakai karakter)
    ├── <nama-project>.mp4       # Hasil render final MP4
    └── assets/                  # (Opsional) Hanya kalau project punya aset lokal sendiri
```

## Alur Kerja Cepat

1. **Buat project baru**:
   ```bash
   cp -R projects/_template projects/<nama-project>
   ```
2. **Generate envelope lip-sync & deteksi jeda kalimat** (setelah menaruh `vo.mp3`):
   ```bash
   node projects/_shared/scripts/envelope.mjs projects/<nama-project>
   ```
3. **Render ke MP4 (`1080×1920`, `30fps`)**:
   ```bash
   node projects/_shared/scripts/render.mjs projects/<nama-project>
   ```

Aturan lengkap kanvas, safe zone, kartu ilustrasi, dan karakter berbicara ada di [`AGENTS.md`](AGENTS.md). Daftar rencana produksi video berikutnya ada di [`TODO.md`](TODO.md).

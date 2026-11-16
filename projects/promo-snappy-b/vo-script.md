# Naskah VO — Promo B "Snap! Snap! Snap!" (30,00 dtk · 120 BPM)

Generator: `python3 tools/gen_vo.py` → `assets/vo/vo1..9.mp3` (Edge-TTS `id-ID-GadisNeural`, pitch +6–8Hz, energik).
"Tiga, dua, satu" dipecah jadi 3 klip agar tiap angka jatuh tepat di angka raksasa (ketukan 14.5 / 15.5 / 16.5).
Waktu mulai ada di `VO_START` dalam `index.html` (ucapan mulai ±0,2 dtk setelah waktu klip).

| Klip | Mulai | Rate | Kalimat | Visual |
|---|---|---|---|---|
| vo1 | 0.30 | +12% | Siap gaya? Snappy Photo Corner! | hitam → SNAP SNAP SNAP |
| vo2 | 6.30 | +14% | Scan QRIS, langsung masuk booth. | ponsel QRIS, Rp 35rb → LUNAS! |
| vo3 | 10.20 | +12% | Pilih frame, terus hitung mundur. | kartu frame dibalik tiap ketukan |
| vo4 | 14.30 | +10% | Tiga! | angka 3 |
| vo5 | 15.30 | +10% | Dua! | angka 2 |
| vo6 | 16.28 | +10% | Satu! | angka 1 → flash 17.5 |
| vo7 | 18.30 | +12% | Ganti filter, tempel stiker, sesukamu. | Original → B&W (19.0) → Vintage (20.0), stiker |
| vo8 | 21.60 | +25% | Cetak empat R, tebal, tahan air, glossy! | CETAK 4R, kertas jatuh 23.0 |
| vo9 | 26.00 | +30% | Pose dulu, sisanya urusan kami. Yuk ke booth terdekat! | mosaik ✦ → lockup + CTA |

Musik latar disintesis langsung di kode (Web Audio, 120 BPM, Am–F–C–G), tanpa file.

## Suara default: Serena — Heartfelt Indonesian (ElevenLabs)
Sumber: satu rekaman dari situs ElevenLabs (`assets/vo_serena/source-serena-full.mp3`, 19,1 dtk), dipotong di jeda kalimat menjadi `assets/vo_serena/vo1..9.m4a` (padding 50 ms + fade 15 ms).
VO_START Serena: 0.47 · 6.45 · 10.33 · 14.44 · 15.44 · 16.48 · 18.44 · 21.70 · 26.12 (angka 3-2-1 di ketukan 14.5 / 15.5 / 16.5).

Suara lain lewat `?voice=sarah` (ElevenLabs Sarah, `tools/gen_vo_eleven.py` → `assets/vo_eleven/`) atau `?voice=gadis` (Edge-TTS → `assets/vo/`), atau pemilih suara di `?debug=1`.

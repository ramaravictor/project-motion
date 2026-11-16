# Naskah VO — Snappy Photo Corner (35,00 dtk, 7 segmen)

Generator: `python3 tools/gen_vo.py`
- ElevenLabs `eleven_multilingual_v2`, voice `EXAVITQu4vr4xnSDxMaL` (stability .45, similarity .80, style .35, speaker boost) → `assets/vo_bella/` — hanya jika `ELEVENLABS_API_KEY` ada di env
- Edge-TTS `id-ID-GadisNeural` → `assets/vo/` (default di video), `id-ID-ArdiNeural` → `assets/vo_ardi/`
- Rate Edge per segmen dinaikkan (+10…+40%) agar ucapan muat di slotnya; pitch +0Hz

| # | Slot | Mulai VO | Rate | Kalimat |
|---|---|---|---|---|
| 1 | 00.0–04.5 | 0.00 | +40% | Selamat datang di Snappy Photo Corner. Pose dulu, sisanya urusan kami! |
| 2 | 04.5–09.5 | 4.75 | +22% | Bayar praktis pakai QRIS. Cukup scan, dan booth langsung siap. |
| 3 | 09.5–14.5 | 9.60 | +16% | Langkah satu, pilih layout dan frame favoritmu lewat carousel liquid glass. |
| 4 | 14.5–20.5 | 14.60 | +10% | Langkah dua, pose! Kamera studio HD siap jepret senyum terbaikmu! |
| 5 | 20.5–25.5 | 20.55 | +10% | Langkah tiga, atur filter analog favoritmu dan tambahkan stiker lucu. |
| 6 | 25.5–30.5 | 25.50 | +26% | Langkah empat, cetak foto fisik empat R tebal, tahan air, dan glossy! |
| 7 | 30.5–35.0 | 30.30 | +40% | Scan QR di layar untuk simpan foto dan share ke Story. Yuk cobain sekarang! |

Waktu mulai ada di `VO_START` dalam `index.html`.

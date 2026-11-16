"""VO promo B -> assets/vo/vo{1..9}.mp3 (Edge-TTS id-ID-GadisNeural, energik)."""
import asyncio, pathlib, edge_tts
LINES = [
 ("Siap gaya? Snappy Photo Corner!", "+12%", "+6Hz"),
 ("Scan QRIS, langsung masuk booth.", "+14%", "+6Hz"),
 ("Pilih frame, terus hitung mundur.", "+12%", "+6Hz"),
 ("Tiga!", "+10%", "+8Hz"),   # klip angka terpisah agar jatuh tepat di angka raksasa
 ("Dua!", "+10%", "+8Hz"),
 ("Satu!", "+10%", "+8Hz"),
 ("Ganti filter, tempel stiker, sesukamu.", "+12%", "+6Hz"),
 ("Cetak empat R, tebal, tahan air, glossy!", "+25%", "+6Hz"),
 ("Pose dulu, sisanya urusan kami. Yuk ke booth terdekat!", "+30%", "+6Hz"),
]
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "vo"
async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (t, r, p) in enumerate(LINES, 1):
        await edge_tts.Communicate(t, "id-ID-GadisNeural", rate=r, pitch=p).save(str(OUT / f"vo{i}.mp3")); print("vo", i, r)
asyncio.run(main())

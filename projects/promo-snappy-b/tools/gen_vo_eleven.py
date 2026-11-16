"""VO promo B via ElevenLabs -> assets/vo_eleven/vo{1..9}.mp3

API key dibaca dari env ELEVENLABS_API_KEY, atau dari berkas promo-snappy-b/.env
(baris: ELEVENLABS_API_KEY=...). Key tidak pernah dicetak.
"""
import os, json, pathlib, urllib.request, urllib.error

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "vo_eleven"
MODEL = "eleven_multilingual_v2"
VOICE_ID = os.environ.get("ELEVEN_VOICE_ID", "NPDHDOOQCSyifTJZOe6J")  # voice pilihan user
BASE = {"stability": 0.45, "similarity_boost": 0.80, "style": 0.35, "use_speaker_boost": True}

# (teks, speed 0.7–1.2) — klip angka terpisah agar jatuh tepat di angka raksasa
LINES = [
    ("Siap gaya? Snappy Photo Corner!", 1.05),
    ("Scan QRIS, langsung masuk booth.", 1.05),
    ("Pilih frame, terus hitung mundur.", 1.05),
    ("Tiga!", 1.0),
    ("Dua!", 1.0),
    ("Satu!", 1.0),
    ("Ganti filter, tempel stiker, sesukamu.", 1.05),
    ("Cetak empat R, tebal, tahan air, glossy!", 1.12),
    ("Pose dulu, sisanya urusan kami. Yuk ke booth terdekat!", 1.15),
]

def api_key():
    k = os.environ.get("ELEVENLABS_API_KEY")
    for env in (ROOT / ".env", ROOT.parent / ".env.local", ROOT.parent / ".env"):
        if k or not env.exists():
            continue
        for line in env.read_text().splitlines():
            line = line.strip().removeprefix("export ").strip()
            if line.startswith("ELEVENLABS_API_KEY="):
                k = line.split("=", 1)[1].strip().strip('"\'')
    if not k:
        raise SystemExit("ELEVENLABS_API_KEY tidak ditemukan (env atau promo-snappy-b/.env)")
    return k

def main():
    key = api_key()
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (text, speed) in enumerate(LINES, 1):
        body = {"text": text, "model_id": MODEL, "voice_settings": {**BASE, "speed": speed}}
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128",
            data=json.dumps(body).encode(),
            headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
        try:
            (OUT / f"vo{i}.mp3").write_bytes(urllib.request.urlopen(req, timeout=60).read())
        except urllib.error.HTTPError as e:
            raise SystemExit(f"ElevenLabs error klip {i}: HTTP {e.code} {e.read()[:300].decode(errors='ignore')}")
        print("elevenlabs vo", i, "speed", speed)

if __name__ == "__main__":
    main()

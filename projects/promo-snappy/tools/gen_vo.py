"""Generate 7 VO segments -> assets/vo/vo{1..7}.mp3
ElevenLabs bila ELEVENLABS_API_KEY ada di env; selain itu Edge-TTS id-ID-GadisNeural."""
import os, sys, json, asyncio, urllib.request, pathlib
LINES = [
 "Selamat datang di Snappy Photo Corner. Pose dulu, sisanya urusan kami!",
 "Bayar praktis pakai QRIS. Cukup scan, dan booth langsung siap.",
 "Langkah satu, pilih layout dan frame favoritmu lewat carousel liquid glass.",
 "Langkah dua, pose! Kamera studio HD siap jepret senyum terbaikmu!",
 "Langkah tiga, atur filter analog favoritmu dan tambahkan stiker lucu.",
 "Langkah empat, cetak foto fisik empat R tebal, tahan air, dan glossy!",
 "Scan QR di layar untuk simpan foto dan share ke Story. Yuk cobain sekarang!",
]
# rate per segmen agar muat di slot timeline (Gadis +0% terlalu lambat utk 35 dtk)
EDGE_RATES = ["+40%", "+22%", "+16%", "+10%", "+10%", "+26%", "+40%"]
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "vo"
BELLA = pathlib.Path(__file__).resolve().parent.parent / "assets" / "vo_bella"  # output ElevenLabs
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"
SETTINGS = {"stability": 0.45, "similarity_boost": 0.80, "style": 0.35, "use_speaker_boost": True}

def eleven(key):
    BELLA.mkdir(parents=True, exist_ok=True)
    for i, text in enumerate(LINES, 1):
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128",
            data=json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": SETTINGS}).encode(),
            headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
        (BELLA / f"vo{i}.mp3").write_bytes(urllib.request.urlopen(req).read())
        print("elevenlabs", i)

async def edge(voice="id-ID-GadisNeural", out=None):
    import edge_tts
    out = out or OUT; out.mkdir(parents=True, exist_ok=True)
    for i, text in enumerate(LINES, 1):
        await edge_tts.Communicate(text, voice, rate=EDGE_RATES[i-1], pitch="+0Hz").save(str(out / f"vo{i}.mp3"))
        print("edge-tts", voice, i)

OUT.mkdir(parents=True, exist_ok=True)
# Default: Gadis (assets/vo) + Ardi (assets/vo_ardi); ElevenLabs Bella (assets/vo_bella) bila key ada.
key = os.environ.get("ELEVENLABS_API_KEY")
if key and "--edge" not in sys.argv:
    try:
        eleven(key)
    except Exception as e:
        print("ElevenLabs gagal (Edge-TTS tetap dipakai):", e)
else:
    print("ELEVENLABS_API_KEY tidak ada -> lewati ElevenLabs")
asyncio.run(edge())
asyncio.run(edge("id-ID-ArdiNeural", OUT.parent / "vo_ardi"))

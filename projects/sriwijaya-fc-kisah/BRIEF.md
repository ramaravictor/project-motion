# Sriwijaya FC: Lampu Terakhir di Jakabaring (seri 3 part)

Pengecualian dari AGENTS.md atas permintaan user: TANPA template ChillDev (tanpa header, tanpa Rama, tanpa latar krem). Hanya hukum Bang Motion yang berlaku.

## Style brief (Opsi C, Malam di Jakabaring)
- Tema: elegi untuk klub yang jatuh. Perasaan yang dituju: rindu, kehilangan, getir.
- Konsep: satu dunia, yaitu Stadion Gelora Sriwijaya Jakabaring di malam hari. Di setiap babak keruntuhan, satu lampu sorot padam. Hero yang bertahan di seluruh seri adalah stadion itu sendiri: lampu sorot, papan skor dot-matrix, tribun kursi kuning.
- Palet:
  - Langit malam: #0b1430 → #070b18 (turunan, malam).
  - Kursi dan aksen kuning: #f5c400. Turunan dari kuning-hijau Sriwijaya.
  - Hijau lapangan: #0e2a1d.
  - Cahaya lampu: #ffe7a6.
  - LED papan skor: amber #ffb340 dan merah #ff5a4a.
- Font:
  - Cormorant Garamond 600 (dan italic) untuk kalimat elegi.
  - DotGothic16 untuk papan skor.
  - Pendamping kecil: IBM Plex Mono untuk tahun dan angka.
- Penekanan: tanpa pill. Kata kunci ditulis italic emas #f0c35a.
- Bahasa latar per part:
  - Part 1: stadion terang benderang, konfeti kuning, tribun penuh.
  - Part 2: lampu padam bergiliran, tribun menipis.
  - Part 3: tinggal satu lampu, kursi kosong.
  - Setiap pergantian dipicu oleh aksi yang terlihat, yaitu lampu yang padam dan "klik", bukan cross-fade.
- Tanda tangan gerak: lampu sorot yang padam. Lampu berkedip 2–3 kali, sinarnya menghilang, lalu dunia menggelap satu tingkat.
- Gerak latar: debu/serangga melayang di dalam sinar lampu, sinar sedikit berayun, grain halus. Tidak boleh ada "benda melintas ke samping".
- Gaya render objek: vektor flat dengan glow (cahaya volumetrik palsu dari gradien).
- Transisi:
  - Push-through dari tribun ke papan skor.
  - Kamera turun dari lampu ke kursi.
  - Cut tepat di momen lampu padam.
- **Kliping dari Opsi A (keputusan user):** babak sejarah dibawa oleh kliping koran yang hidup DI DALAM dunia stadion. Kliping jatuh berputar ke dalam sinar lampu sorot, mendarat di tribun atau rumput, lalu kamera mendekat untuk membacanya.
  - Part 1: kliping cerah dengan halftone kuning-hijau (2004, double winner 2007/08, Copa, ISL 2011/12). Tiap kliping menumpuk di atas yang sebelumnya.
  - Part 2: kliping makin kusam dan pudar ke abu (degradasi 2018, sanksi FIFA, utang), dengan stempel merah Special Elite (DEGRADASI, SANKSI FIFA).
  - Part 3: tanpa kliping baru, hanya papan skor dan lampu. Di adegan terakhir, satu kliping 2008 yang sudah pudar tergeletak di kursi kuning di bawah lampu terakhir. Ini benang merah dari Part 1.
  - Font kliping: Playfair Display 900 untuk judul, Old Standard TT untuk masthead, Special Elite untuk stempel. Kliping dihitung sebagai OBJEK (≤ 3 baris pendek), bukan tingkat teks.
- Momen istimewa:
  - Part 1: konfeti meledak di "double winner".
  - Part 2: dua lampu padam berurutan.
  - Part 3: lampu terakhir.
- Format: 9:16, 1080×1920, 30 fps. Tanpa caption dan tanpa player (autoplay + loop, `?debug=1`).
- Branding: hanya `@ramarvctr_` kecil di frame akhir tiap part, kecuali user meminta lain.
- Wajah orang nyata TIDAK digambar atau digenerate. Tokoh hanya tampil sebagai nama di papan skor atau label.

## Fakta (sumber)
- Wikipedia ID/EN Sriwijaya FC:
  - Berdiri 23 Okt 2004 dari Persijatim Solo FC, lalu pindah ke Palembang.
  - Double winner 2007/08 (Liga Indonesia + Copa Indonesia), klub pertama di Indonesia. Pelatih Rahmad Darmawan.
  - Copa 2007/08, 2008/09, 2010.
  - Juara ISL 2011/12.
  - Community Shield 2010. Inter Island Cup 2010, 2012.
  - Liga 1 2018 finis ke-16, degradasi ke Liga 2.
  - Championship 2025/26 finis ke-10, degradasi ke Liga Nusantara.
  - Stadion Gelora Sriwijaya, 23.000 kursi.
  - Legenda klub: Keith Kayamba Gumbs, Zah Rahan, Ponaryo Astaman, Ferry Rotinsulu.
- Harapan Rakyat (9 Nov 2026):
  - Bang Gumay (Selamat Raharjo Gumay) batal mengakuisisi klub. PT Digi Sport Asia meminta Rp4 M.
  - Denda FIFA Rp810 jt naik jadi Rp2,7 M. Sengketa hukum Rp1,3 M. Tunggakan gaji lewat APPI.
  - Total utang sekitar Rp4,1 M.
- Sripoku via IG @sriwijayafcnewss:
  - PT LIB menetapkan Sriwijaya FC tidak memenuhi syarat Liga Nusantara 2026/27.
  - Kutipan Anggoro Prajesta (CEO PT Digi Sport Asia): "Saya gak berani statement Pak, takut salah."
- Catatan: grafis JMTV menulis "pilih mundur". Video memakai versi keputusan LIB.

## Part 4 · Lampu di tiang sebelah (permintaan user)
- Konsep visual: di dunia stadion yang sama, tiang lampu kelima yang BARU menyala terang dengan warna lain (bukan kuning Sriwijaya), menyorot sisi tribun yang lain, sementara lampu Sriwijaya tetap padam. Kliping: era APBD (2004, cerah), Permendagri 22/2011 (dokumen bercap), 2018 peralihan gubernur (pudar), Juni 2025 Sumsel United (kliping baru, mengilap).
- Fakta (dicek lewat web-search 12 Nov 2026; hasil berupa ringkasan mesin pencari, BUKAN sumber primer, jadi tetap perlu konfirmasi user):
  - 23 Okt 2004: Pemprov Sumsel (Gub. Syahrial Oesman) membeli lisensi Persijatim Solo FC pasca PON XVI, didanai APBD.
  - Permendagri No. 22/2011 (pedoman APBD 2012) melarang APBD untuk klub profesional; SFC dikelola PT SOM, tetap juara ISL 2011/12.
  - 2018: Presiden klub Dodi Reza Alex Noerdin kalah Pilgub dari Herman Deru, lalu mundur; sponsor menarik diri, gaji menunggak; Juli 2018 Rahmad Darmawan + ±9 pemain hengkang; SFC degradasi. (Detail nama ini BELUM masuk naskah.)
  - Kongres PSSI 4–6 Juni 2025: akuisisi lisensi Persikas Subang jadi Sumsel United; Presiden klub Wagub Cik Ujang; kandang Jakabaring; Cik Ujang menyebut SFC "kakak" dan menyatakan tidak berniat mematikannya.
- Framing: "campur tangan politik" ditulis sebagai penilaian ("banyak yang menilai"), bukan tuduhan. TIDAK dipakai sampai ada sumber primer: kutipan Syahrial "tanpa back up politik", aksi keranda, klaim sponsor BUMN pindah ke Sumsel United. Tanpa logo Sumsel United dan tanpa wajah pejabat.

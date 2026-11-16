#!/usr/bin/env bash
# Rakit kompilasi: hook + #5..#1, teks 2-3 ketukan per segmen, tanpa VO.
# Pakai: bash render.sh   (dari folder project)
set -e
cd "$(dirname "$0")"
node overlay/build-overlays.mjs
mkdir -p work/seg

# Crop gambar asli: sumber 4:3 di dalam frame 16:9 (x 160-1120) dan potong atas untuk buang logo TV/scorebug.
CROP43="crop=880:495:200:150"
CROPW="crop=1000:562:140:120"

# id | sumber | mulai | durasi | crop | ketukan "png:mulai,png:mulai,..."
SEGS=(
  "0|yg_iLrespcQ|38|3.5|$CROP43|hook-a:0,hook-b:1.6"
  "1|24LyVTNsrr4|244|10|$CROP43|5-a:0,5-b:5"
  "2|yg_iLrespcQ|12|10|$CROP43|4-a:0,4-b:7"
  "3|AcQS09sbVww|334|11|$CROPW|3-a:0,3-b:6.5"
  "4|24LyVTNsrr4|16|10|$CROP43|2-a:0,2-b:4.5"
  "5|yg_iLrespcQ|35|10|$CROP43|1-a:0,1-b:2,1-c:7.5"
)

for s in "${SEGS[@]}"; do
  IFS='|' read -r n id st d crop beats <<< "$s"
  IFS=',' read -ra B <<< "$beats"
  inputs=(); chain=""; last="v"; k=0
  for i in "${!B[@]}"; do
    png=${B[$i]%%:*}; t0=${B[$i]#*:}
    if (( i + 1 < ${#B[@]} )); then t1=${B[$((i+1))]#*:}; else t1=$d; fi
    inputs+=(-loop 1 -t "$d" -i "work/ov/$png.png"); k=$((k+1))
    chain="$chain;[$last][$k:v]overlay=0:0:enable='between(t,$t0,$t1-0.001)'[o$k]"; last="o$k"
  done
  fo=$(echo "$d-0.2" | bc)
  FC="[0:v]$crop,split[a][b];[a]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=10:2,scale=1080:1920,eq=brightness=-0.25[bg];[b]scale=1080:608[fg];[bg][fg]overlay=0:580[v]$chain;[$last]fps=30,format=yuv420p[out];[0:a]aresample=48000,pan=stereo|c0=c0|c1=c1,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.15,afade=t=out:st=$fo:d=0.2[af]"
  ffmpeg -v error -y -ss "$st" -t "$d" -i "source/$id.mp4" "${inputs[@]}" -filter_complex "$FC" \
    -map "[out]" -map "[af]" -ar 48000 -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k "work/seg/$n.mp4"
done

printf "file seg/%s.mp4\n" 0 1 2 3 4 5 > work/list.txt
ffmpeg -v error -y -f concat -safe 0 -i work/list.txt -c copy -movflags +faststart selebrasi-sfc-top5.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 selebrasi-sfc-top5.mp4

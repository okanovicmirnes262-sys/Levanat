#!/usr/bin/env bash
# Završna obrada za društvene mreže: točno 30,000 s, yuv420p (TV raspon), BT.709,
# H.264 High, faststart. Upotreba: alati/zavrsi.sh ulaz.mp4 izlaz.mp4
set -euo pipefail
FFMPEG="${FFMPEG:-ffmpeg}"
"$FFMPEG" -y -v error -i "$1" \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level:v 4.2 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -af "atrim=0:30,asetpts=PTS-STARTPTS" -c:a aac -b:a 320k -ar 48000 \
  -t 30 -movflags +faststart "$2"

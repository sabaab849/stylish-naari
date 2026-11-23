#!/usr/bin/env bash
# Two raw clips -> one enhanced reel, joined with a blur transition (client, 23 Nov 2026: Bulbul). Same treatment as enhance-reel.sh
# (vid.stab 12 frames / 24 px cap, highlight roll-off, contrast +4 %, saturation +3 %, light denoise + sharpen, 1080x1920, 25 fps, no sound),
# after cutting each clip's shaky start and end. Originals untouched. Writes:
#   <folder of clip A>/<slug> - enhanced (merged).mp4, assets/video/<slug>-reel(.mp4|-small.mp4), assets/images/<slug>-reel-poster.jpg
# Usage (from homepage/): FFMPEG=<ffmpeg.exe> _tools/enhance-reel-merge.sh <slug> "<clip A>" <A start> <A length> "<clip B>" <B start> <B length> [blur seconds]
set -euo pipefail
SLUG="$1"; A="$2"; AS="$3"; AD="$4"; B="$5"; BS="$6"; BD="$7"; X="${8:-0.6}"
FF="${FFMPEG:?set FFMPEG}"; DIR="$(dirname "$A")"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
SCALE="scale=1080:1920:flags=lanczos"
GRADE="lutyuv=y='if(gt(val\,200)\,200+(val-200)*35/55\,val)',eq=contrast=1.04:saturation=1.03,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0"
STAB="vidstabtransform=input=trf.trf:smoothing=12:maxshift=24:optzoom=1:interpol=bicubic"
one() { SM="${5:-12}"; MS="${6:-24}"; SL="${7:-1}"; STABX="vidstabtransform=input=trf.trf:smoothing=$SM:maxshift=$MS:optzoom=1:interpol=bicubic" # name src start len
  ( cd "$TMP" && "$FF" -v error -y -ss "$3" -t "$4" -i "$2" -an -vf "$SCALE,vidstabdetect=shakiness=6:accuracy=15:stepsize=6:result=trf.trf" -f null - \
    && "$FF" -v error -y -ss "$3" -t "$4" -i "$2" -an -vf "$SCALE,$STABX,setpts=$SL*PTS,$GRADE,fps=25" -c:v libx264 -crf 12 -preset medium -pix_fmt yuv420p "$1.mp4" )
}
one a "$A" "$AS" "$AD" 12 24 1; one b "$B" "$BS" "$BD" "${BSM:-40}" "${BMS:-48}" "${BSLOW:-2}"
OFF=$(awk -v d="$AD" -v x="$X" 'BEGIN{printf "%.2f", d-x}')
( cd "$TMP" && "$FF" -v error -y -i a.mp4 -i b.mp4 -filter_complex "[0:v][1:v]xfade=transition=hblur:duration=$X:offset=$OFF,format=yuv420p[v]" -map "[v]" -r 25 -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart master.mp4 )
cp "$TMP/master.mp4" "$DIR/$SLUG - enhanced (merged).mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -c:v libx264 -crf 22 -maxrate 6M -bufsize 12M -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -vf "scale=432:768:flags=lanczos" -c:v libx264 -crf 25 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel-small.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -frames:v 1 -q:v 2 "assets/images/$SLUG-reel-poster.jpg"
echo "done $SLUG"

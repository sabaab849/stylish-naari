#!/usr/bin/env bash
# Enhance a raw saree video for a PDP reel (client-approved settings, Gulkand, 23 Nov 2026). Keeps the original untouched and writes:
#   <original folder>/<name> - enhanced.mp4           1080×1920, high quality master (no sound)
#   assets/video/<slug>-reel.mp4 / -reel-small.mp4    the site's reel (1080×1920) and phone/slow-connection copy (432×768), no sound
#   assets/images/<slug>-reel-poster.jpg              first frame, for the poster
# Treatment (deliberately subtle; never changes the saree's colour):
#   stabilise   vid.stab, smoothing 12 frames (~¼ s), corrections capped at 24 px, minimal automatic zoom → removes jitter, keeps the camera move
#   exposure    only the brightest highlights rolled off (Y > 200 compressed into the legal range) → recovers clipped zari
#   colour      no white-balance change; contrast +4 %, saturation +3 %
#   detail      light denoise (hqdn3d 1:1:2:2), gentle sharpen (unsharp 0.4); output 25 fps
# SMOOTH=<frames> sets a firmer stabilisation (default 12; Hiran 30). GRADE=<filters> overrides the exposure/colour step for one clip (Elaichi, 23 Nov 2026: bright sunlit background, see CLAUDE.md).
# Usage (from homepage/): FFMPEG=<ffmpeg.exe> _tools/enhance-reel.sh <slug> "<original video>" [start seconds] [duration]
set -euo pipefail
SLUG="$1"; SRC="$2"; START="${3:-0}"; DUR="${4:-}"
FF="${FFMPEG:?set FFMPEG}"
DIR="$(dirname "$SRC")"; BASE="$(basename "${SRC%.*}")"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
T=(-ss "$START"); [ -n "$DUR" ] && T+=(-t "$DUR")
SCALE="scale=1080:1920:flags=lanczos"
GRADE_DEFAULT="lutyuv=y='if(gt(val\,200)\,200+(val-200)*35/55\,val)',eq=contrast=1.04:saturation=1.03,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0"
GRADE="${GRADE:-$GRADE_DEFAULT}"
( cd "$TMP" && "$FF" -v error -y "${T[@]}" -i "$SRC" -an -vf "$SCALE,vidstabdetect=shakiness=6:accuracy=15:stepsize=6:result=trf.trf" -f null - )
STAB="vidstabtransform=input=trf.trf:smoothing=${SMOOTH:-12}:maxshift=24:optzoom=1:interpol=bicubic"
( cd "$TMP" && "$FF" -v error -y "${T[@]}" -i "$SRC" -an -vf "$SCALE,$STAB,$GRADE,fps=25" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart master.mp4 )
cp "$TMP/master.mp4" "$DIR/$BASE - enhanced.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -c:v libx264 -crf 22 -maxrate 6M -bufsize 12M -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -vf "scale=432:768:flags=lanczos" -c:v libx264 -crf 25 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel-small.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -frames:v 1 -q:v 2 "assets/images/$SLUG-reel-poster.jpg"
echo "done: $DIR/$BASE - enhanced.mp4, assets/video/$SLUG-reel(.small).mp4, assets/images/$SLUG-reel-poster.jpg"

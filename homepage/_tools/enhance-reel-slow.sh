#!/usr/bin/env bash
# One raw clip -> slowed, stabilised, enhanced reel (client, 23 Nov 2026: Narangi). Same grade as enhance-reel-merge.sh (highlight roll-off,
# contrast +4 %, saturation +3 %, light denoise + sharpen, 1080x1920, 25 fps, no sound); stronger vid.stab because slow motion shows shake.
# STABZOOM="optzoom=0:zoom=7:crop=keep" fixes the zoom (Dariya twirl, 23 Nov 2026) so firmer SMOOTH does not crop further.
# Usage (from homepage/): FFMPEG=<ffmpeg.exe> _tools/enhance-reel-slow.sh <slug> "<absolute clip path>" <start> <length> [slow factor, 2 = half speed]
set -euo pipefail
SLUG="$1"; A="$2"; AS="$3"; AD="$4"; SL="${5:-2}"; FF="${FFMPEG:?set FFMPEG}"; DIR="$(dirname "$A")"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
SCALE="scale=1080:1920:flags=lanczos"
GRADE_DEFAULT="lutyuv=y='if(gt(val\,200)\,200+(val-200)*35/55\,val)',eq=contrast=1.04:saturation=1.03,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0"
GRADE="${GRADE:-$GRADE_DEFAULT}"  # override per clip (Dariya, 23 Nov 2026: overexposed sunlit arcade)
( cd "$TMP" && "$FF" -v error -y -ss "$AS" -t "$AD" -i "$A" -an -vf "$SCALE,vidstabdetect=shakiness=6:accuracy=15:stepsize=6:result=trf.trf" -f null - \
  && "$FF" -v error -y -ss "$AS" -t "$AD" -i "$A" -an -vf "$SCALE,vidstabtransform=input=trf.trf:smoothing=${SMOOTH:-30}:maxshift=${MAXSHIFT:-40}:${STABZOOM:-optzoom=1}:interpol=bicubic,setpts=$SL*PTS,$GRADE,fps=25" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart master.mp4 )
cp "$TMP/master.mp4" "$DIR/$SLUG - enhanced (slow).mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -c:v libx264 -crf 22 -maxrate 6M -bufsize 12M -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -vf "scale=432:768:flags=lanczos" -c:v libx264 -crf 25 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/video/$SLUG-reel-small.mp4"
"$FF" -v error -y -i "$TMP/master.mp4" -frames:v 1 -q:v 2 "assets/images/$SLUG-reel-poster.jpg"
echo "done $SLUG"

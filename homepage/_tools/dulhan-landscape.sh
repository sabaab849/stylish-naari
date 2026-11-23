#!/usr/bin/env bash
# The Dulhan Edit film for the homepage hero (client, 23 Nov 2026). Cuts BOTH web versions from the 2160×3840 master:
#   assets/video/dulhan-hero-wide.mp4 (+ -small)   landscape: a 16:9 window (2160×1215) whose height follows the sarees shot by shot
#                                                   (KEYS = [seconds in the ORIGINAL film, centre as a share of the frame height], eased over 1.2 s),
#                                                   scaled down to 1920×1080; ends before the closing logo card (taller than a 16:9 window)
#   assets/video/dulhan-hero.mp4 (+ -small)        portrait: the film itself at 1080×1920, whole, including the logo card
# Both drop the shot CUT_A → CUT_B (the hand-on-hip close-up against the cracked wall, client, 23 Nov 2026; boundaries found with scene
# detection: 26.93 s and 30.85 s) and the music is cross-faded over the join (0.25 s) so it does not jump. No grading, no sharpening.
# Usage (from homepage/): FFMPEG=<ffmpeg.exe> _tools/dulhan-landscape.sh "<set 01 - dulhan.mp4>"
set -euo pipefail
FF="${FFMPEG:?set FFMPEG}"; SRC="$1"
CUT_A="${CUT_A:-26.93}"; CUT_B="${CUT_B:-30.85}"; XF=0.25; END="${END:-38.2}"
# Centres sit LOW on the close-ups so the sarees lead and the faces are not the subject; 0-12 s keeps the baked-in lettering whole.
KEYS="${KEYS:-0:.52 3:.52 6:.52 9:.52 12:.55 15:.64 18:.62 21:.58 24:.58 27:.58 30:.60 33:.62 36:.58}"
EXPR="0"; PREV=""; PT=""
for k in $KEYS; do t="${k%%:*}"; c="${k##*:}"
  if [ -z "$PREV" ]; then EXPR="$c"; else
    EXPR="$EXPR+($c-$PREV)*(clip((t-$PT)/1.2,0,1)*clip((t-$PT)/1.2,0,1)*(3-2*clip((t-$PT)/1.2,0,1)))"; fi
  PREV="$c"; PT="$t"; done
Y="clip(3840*($EXPR)-607.5\,0\,3840-1215)"
CT="-colorspace bt709 -color_primaries bt709 -color_trc bt709"
AFTER_A=$(awk "BEGIN{print $CUT_A+$XF}")
AUD_W="[0:a]atrim=0:$AFTER_A,asetpts=PTS-STARTPTS[a1];[0:a]atrim=$CUT_B:$END,asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d=$XF[a]"
AUD_T="[0:a]atrim=0:$AFTER_A,asetpts=PTS-STARTPTS[a1];[0:a]atrim=$CUT_B,asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d=$XF[a]"
ENC="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p $CT -r 30 -c:a aac -b:a 192k -movflags +faststart"

"$FF" -v error -y -i "$SRC" -filter_complex "[0:v]crop=w=2160:h=1215:x=0:y='$Y',scale=1920:1080:flags=lanczos,setsar=1,split[c1][c2];[c1]trim=0:$CUT_A,setpts=PTS-STARTPTS[v1];[c2]trim=$CUT_B:$END,setpts=PTS-STARTPTS[v2];[v1][v2]concat=n=2:v=1:a=0[v];$AUD_W" -map "[v]" -map "[a]" $ENC -crf 19 -maxrate 6M -bufsize 12M assets/video/dulhan-hero-wide.mp4
"$FF" -v error -y -i assets/video/dulhan-hero-wide.mp4 -vf "scale=960:540:flags=lanczos" -c:v libx264 -crf 24 -maxrate 1.6M -bufsize 3M -preset slow -profile:v high -pix_fmt yuv420p $CT -r 30 -c:a copy -movflags +faststart assets/video/dulhan-hero-wide-small.mp4
"$FF" -v error -y -i "$SRC" -filter_complex "[0:v]scale=1080:1920:flags=lanczos,split[c1][c2];[c1]trim=0:$CUT_A,setpts=PTS-STARTPTS[v1];[c2]trim=$CUT_B,setpts=PTS-STARTPTS[v2];[v1][v2]concat=n=2:v=1:a=0[v];$AUD_T" -map "[v]" -map "[a]" $ENC -crf 20 -maxrate 5M -bufsize 10M assets/video/dulhan-hero.mp4
"$FF" -v error -y -i assets/video/dulhan-hero.mp4 -vf "scale=540:960:flags=lanczos" -c:v libx264 -crf 24 -maxrate 1.6M -bufsize 3M -preset slow -profile:v high -pix_fmt yuv420p $CT -r 30 -c:a copy -movflags +faststart assets/video/dulhan-hero-small.mp4
"$FF" -v error -y -i assets/video/dulhan-hero-wide.mp4 -frames:v 1 -q:v 2 assets/images/dulhan-hero-wide-poster.jpg
"$FF" -v error -y -i assets/video/dulhan-hero.mp4 -frames:v 1 -q:v 2 assets/images/dulhan-hero-poster.jpg
echo done

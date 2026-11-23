#!/usr/bin/env bash
# Dariya reel: clean the grey smudges on the model's raised upper arm (client, 23 Nov 2026), 0–4.4 s of the enhanced master.
# A 300×260 box (a mask, merged with maskedmerge so every frame stays in sync; overlay lagged a frame and left a seam) follows the smudge (still until 2.8 s, then keyframed every 0.2 s as the arm moves). Inside it, brightness only (Y plane):
# pixels 3–70 levels darker than a sigma-18 blur of their surroundings are lifted 95 % of the way to it (skin only: Y > 70);
# only skin-coloured pixels are touched (mask: Cb 98–122, Cr 127–158, Y 70–200, softened), so the blouse and bangles are never
# altered; chroma is pulled to the blur only for the small grey/blue shift of the smudge, never for the alta red (V < 140).
# Run after enhance-reel-slow.sh (see products.json → dariya.video.sources). Writes "<master> (arm cleaned).mp4" beside the
# master and replaces the site reel, small copy and poster. Usage (from homepage/): FFMPEG=<ffmpeg.exe> _tools/clean-dariya-arm.sh
set -euo pipefail
FF="${FFMPEG:?set FFMPEG}"
DIR="$(cd "$(dirname "$0")/../.." && pwd)/model photography/saree videos/saree model vids/dariya"
M="$DIR/dariya - enhanced (slow).mp4"; OUT="$DIR/dariya - enhanced (slow, arm cleaned).mp4"
X="if(lt(t,2.8),820,if(lt(t,3),820+(t-2.8)*150,if(lt(t,3.2),850-(t-3)*300,if(lt(t,3.4),790-(t-3.2)*350,if(lt(t,3.6),720-(t-3.4)*350,if(lt(t,4),650-(t-3.6)*300,530))))))"; Y="if(lt(t,2.8),560,if(lt(t,3),560+(t-2.8)*150,if(lt(t,3.2),590,if(lt(t,3.4),590+(t-3.2)*150,if(lt(t,3.6),620+(t-3.4)*100,640)))))"
FC="[0:v]format=yuv444p,split=4[o][b][m][o2];[b]gblur=sigma=18[bb];[o][bb]blend=c0_expr='if(between(B-A,3,70)*gt(A,70),A+(B-A)*0.95,A)':c1_expr='if(between(A-B,2,18),B,A)':c2_expr='if(between(B-A,2,14)*lt(A,140),B,A)'[fx];[m]geq=lum='255*between(cb(X,Y),98,122)*between(cr(X,Y),127,158)*between(lum(X,Y),70,200)*between(X,if(lt(T,2.8),820,if(lt(T,3),820+(T-2.8)*150,if(lt(T,3.2),850-(T-3)*300,if(lt(T,3.4),790-(T-3.2)*350,if(lt(T,3.6),720-(T-3.4)*350,if(lt(T,4),650-(T-3.6)*300,530)))))),if(lt(T,2.8),820,if(lt(T,3),820+(T-2.8)*150,if(lt(T,3.2),850-(T-3)*300,if(lt(T,3.4),790-(T-3.2)*350,if(lt(T,3.6),720-(T-3.4)*350,if(lt(T,4),650-(T-3.6)*300,530))))))+300)*between(Y,if(lt(T,2.8),560,if(lt(T,3),560+(T-2.8)*150,if(lt(T,3.2),590,if(lt(T,3.4),590+(T-3.2)*150,if(lt(T,3.6),620+(T-3.4)*100,640))))),if(lt(T,2.8),560,if(lt(T,3),560+(T-2.8)*150,if(lt(T,3.2),590,if(lt(T,3.4),590+(T-3.2)*150,if(lt(T,3.6),620+(T-3.4)*100,640)))))+260)*lt(T,4.4)',gblur=sigma=4[mk];[o2][fx][mk]maskedmerge,format=yuv420p"
"$FF" -v error -y -i "$M" -filter_complex "$FC" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$OUT"
"$FF" -v error -y -i "$OUT" -c:v libx264 -crf 22 -maxrate 6M -bufsize 12M -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an assets/video/dariya-reel.mp4
"$FF" -v error -y -i "$OUT" -vf "scale=432:768:flags=lanczos" -c:v libx264 -crf 25 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an assets/video/dariya-reel-small.mp4
"$FF" -v error -y -i "$OUT" -frames:v 1 -q:v 2 assets/images/dariya-reel-poster.jpg
echo "done: $OUT"

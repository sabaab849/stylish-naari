# Craft page hero

The top of the Craft page (`/craft`) plays **one** video, `assets/video/craft-hero-loop.mp4`. It's a 24-second
seamless loop with a new craft scene every 3 seconds, built by `homepage/_tools/build-craft-loop.mjs`. The scene list
is in [`../README.md`](../README.md).

Right now the handloom and silk-yarn scenes are real, licensed footage. The Kalamkari and zari scenes are slow camera
moves across our own saree photographs, because no free, commercially licensed footage of those crafts exists.

**To put a new clip into the film:** generate or film it (prompts below), save it in `homepage/_source-footage/`, and
change that scene in `SCENES` in `build-craft-loop.mjs` to `{ video: '_source-footage/your-clip.mp4', start: 0 }`.
Then re-run the script. It needs FFmpeg:

```
FFMPEG=path/to/ffmpeg node homepage/_tools/build-craft-loop.mjs
```

Each scene uses 3.6 seconds of a clip: 3 seconds on screen plus the cross-fade. Pick the steadiest few seconds.

**Where footage can come from:** clips you generate (prompts below), footage the brand films or commissions, or stock
footage whose licence allows commercial use. Don't use videos downloaded from YouTube, Pinterest, Instagram or other
brands' sites: they belong to their makers, and using them on a shop is infringement even when the clip is cut up or
re-edited. To use a specific artisan's or channel's footage, ask the creator for written permission or a licence, then
save it here like any other clip.

## Swapping a clip in

1. Generate the clip with its prompt (below) in Google Veo (Flow / VideoFX), Luma Dream Machine or Runway, or film it.
2. Save the full-quality file in `homepage/_source-footage/` and note its source and licence in that folder's README.
3. Point the matching scene in `build-craft-loop.mjs` at it, re-run the script and restart the preview (`npm run dev`).

The photographs that change over the film (the three cards) are listed in `homepage/render/craft-content.mjs` →
`reel.cards`. Each card has its own deck, and one card changes every 7 seconds, in turn. The carved window frames
around them (brass jharokha, teak, walnut) are drawn in `homepage/render/craft-windows.mjs`; their colours are in
`craft.css` (`.craft-window--*`).

## Spec

- **Format:** MP4 (H.264), no audio track, 24 or 25 fps.
- **Size:** 1920×1080 (16:9), under about 4 MB. Phone copy 1280×720, under about 2 MB.
- **Length:** 6–8 seconds. A clip loops while its chapter is showing, so a seamless loop (first and last frame alike) is best.
- **Frame:** keep the subject in the middle third. Phones crop the sides away to show a tall slice of the frame, and the page title sits over the bottom-left, so leave that area calm.
- **No text, logos, watermarks or captions in the frame.** The site sets its own words. Free plans often add a watermark: don't use those exports.
- **Look:** warm, natural light; deep shadows; ivory, umber, indigo and madder red rather than neon or teal-and-orange grading. Slow, steady movement; nothing fast or shaky.

Encoding with ffmpeg (if installed):

```
ffmpeg -i source.mp4 -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=25" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart 03-loom.mp4
ffmpeg -i source.mp4 -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=25" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart 03-loom-720.mp4
ffmpeg -ss 2 -i 03-loom.mp4 -frames:v 1 -q:v 3 03-loom.jpg
```

Raise `-crf` by 2 if a file is over the size limit.

## Prompts

Use them as written; each ends with the shared style line. Generate several takes and keep the steadiest one.

**Shared style line** (add to the end of every prompt):
> 16:9, 6–8 seconds, slow and steady camera, warm natural light, deep soft shadows, rich earthy palette of ivory, umber, indigo and madder red, shallow depth of field, photographic and true to life, no text, no logos, no watermark.

**Prompt 1: hand-painting (Kalamkari), `01-painting`**
> Macro cinematic shot of an Indian artisan's hands drawing intricate floral and creeper motifs on fine cream cotton with a traditional kalam, a slender bamboo pen with a tuft of cloth wrapped near its tip that holds black dye. The line flows steadily from the pen; nearby, a small clay bowl of dye. Warm golden-hour daylight from a window, shallow depth of field, elegant fashion-documentary style.

*Avoid:* a metal nib or fountain pen (a Kalamkari kalam is bamboo), a brush, gloves, Western botanical illustration, a face in frame.

**Prompt 2: loom weaving, `03-loom`**
> Close-up tracking shot of a wooden handloom: a shuttle passes through the open shed of warp threads and the beater presses the weft into a rich silk saree, metallic gold zari threads catching the light. Slow motion, luxurious editorial aesthetic, warm light raking across the threads.

*Avoid:* a power loom or factory machinery, plastic or metal parts in the foreground, hands with jewellery or nail polish, a face in frame.

**Prompt 3: the drape, `04-drape`**
> Cinematic slow-motion shot of a luxurious handwoven saree flowing through the air in a minimalist studio, the cloth rippling in long soft waves, rich earthy tones and a printed border, a shaft of natural sunlight crossing the frame.

*Avoid:* a model's face, wind-machine chaos, a visible studio rig, synthetic shine.

**Prompt 4: our own sarees, `02-cloth` (image-to-video)**

Use the tool's image-to-video mode with one of our own product photographs as the starting frame (for example
`assets/images/hariyali-border.jpg`, `phalsa-texture-wide.jpg`, or a laid-flat shot such as `leela-product.jpg`), so
the cloth on screen is a saree we actually sell:
> Very slow push-in on this saree laid in soft folds. The cloth breathes gently as if touched by a light breeze; light glides across the weave and the zari. Keep every motif, colour and border exactly as in the photograph.

## Before publishing a clip

- **Our sarees must look exactly like our sarees.** AI tools redraw what they show. Compare each frame of an
  image-to-video clip (Prompt 4) with the source photograph. If a motif, border, colour or the weave changes, discard
  the take. A customer has to receive what the film shows.
- **The craft must be correct.** Check that Prompt 1 shows a bamboo kalam, not a nib or brush, and that Prompt 2 shows a
  handloom, not a power loom. If a take looks wrong to someone who knows the craft, don't use it.
- **Generated people are not our artisans.** Prompts 1–3 make illustrative footage. Don't caption or describe these
  clips as our weavers or painters, or as a particular workshop. Real footage of the artisans we work with can replace
  them later, with the same file names.
- **Licence:** check that the plan you use allows commercial use and exports without a watermark. Free plans often
  don't, and terms change. Keep a note of the tool, date and plan for each clip.

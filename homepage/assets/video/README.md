# Craft films

## Craft page hero: `craft-hero-loop.mp4`

The top of `/craft` plays this one video behind the title. It's a 24-second seamless loop with a new craft scene
every 3 seconds, cross-fades baked in:

| Time | Scene |
|---|---|
| 0–3 s | Kalamkari: the painted pallu |
| 3–6 s | Handloom: the shuttle and the weaver's hands |
| 6–9 s | Zari woven into silk |
| 9–12 s | Silk yarn worked by hand |
| 12–15 s | Kalamkari: painted panels |
| 15–18 s | Handloom: closer on the warp |
| 18–21 s | Zari border |
| 21–24 s | Silk yarn on the frame |

- `craft-hero-loop.mp4`: 1920×1080, about 7.4 MB.
- `craft-hero-loop-720.mp4`: 1280×720, about 3.4 MB, served to phones.
- `assets/images/craft-hero-loop.jpg`: the poster frame.

Built by `_tools/build-craft-loop.mjs` from licensed footage (see `_source-footage/README.md`) and slow camera moves
across our own saree photographs. No free, commercially licensed footage of Kalamkari painting or zari work could be
found, so those scenes use photographs. When real footage arrives, add it to `_source-footage/`, change the scene in
the script and re-run it. Prompts for generating clips are in [`craft-reel/README.md`](craft-reel/README.md).

The homepage craft section ("The art of Indian craftsmanship") plays one silent film full-width behind the text.

## Current files (interim)

`craft-film.mp4` (1920×1080, about 3.9 MB) and `craft-film-720.mp4` (1280×720, about 1.9 MB, served to phones) are the homepage film: one unbroken 12 s take (22–34 s of the source below) in colour with a light warm grade. `assets/images/craft-film-poster.jpg` is the still shown until it plays. Re-cut with `_tools/encode-film.html`.

`craft-loom-bw.mp4` is the earlier black-and-white cut. The homepage no longer uses it.

| File | Source | Licence |
|---|---|---|
| `craft-loom-bw.mp4` | 10 s cut (20–30 s) of [Pexels video #6701504](https://www.pexels.com/video/loom-machine-used-for-weaving-6701504/), "Loom Machine Used for Weaving", uploaded by the Dr.Vivasayam YouTube Channel. Converted to black and white and re-encoded to 1920×1080 H.264, about 4 MB. | [Pexels licence](https://www.pexels.com/license/): free for commercial use, no attribution required. |

The full-length original (69 MB) is in `_source-footage/`. It isn't loaded by the page, so don't upload it to Shopify.

This is Indian silk handloom footage but not specifically Banarasi. Replace it with the brand's own Varanasi loom footage when you can.

## Replacing it with your own footage

Film a weaver's hands at the handloom: the jacquard lifting, the shuttle, the beater pressing the weft. Keep the camera locked off so the loop is seamless.

**Spec:** MP4 (H.264), 1280×720 or 1920×1080, 8–12 seconds, no audio, under 4 MB. Black and white, or colour converted to B&W. Save it over `craft-loom-bw.mp4` and make a matching poster frame at `assets/images/craft-loom-poster.jpg`.

Use only footage the brand owns or has licensed. Don't use clips from other brands' sites or downloaded from YouTube.

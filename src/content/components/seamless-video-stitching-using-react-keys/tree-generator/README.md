# Tree loop videos

The `tree-*.webm` and `tree-*.mp4` files in the parent folder are a pixel art tree going through the seasons. They are generated procedurally in plain JavaScript (no dependencies) and encoded with ffmpeg.

## Regenerating

Requirements: Node, and an ffmpeg build with `libvpx-vp9` and `hevc_videotoolbox` (macOS).

```sh
./encode.sh
```

This renders raw frames into `out/`, encodes all eight videos into the parent folder, and removes `out/`.

## How it works

### One continuous animation, cut into four clips

`anim.cjs` describes the whole year as a single function of time `tau` in `[0, 4)`, one unit per season: winter, spring, summer, fall. `frame(size, tau)` returns an RGBA buffer for that moment.

`render.cjs` cuts it into four clips. Clip `k` renders frames at `tau = k + f / N` for `f = 0..N` inclusive, so the last frame of each clip is exactly the first frame of the next. `tau = 4` is identical to `tau = 0`, which makes the loop seamless too, and the script prints the number of differing bytes at that seam as a check (it should be `0`).

Two rules keep the boundaries pixel-identical:

- Wind sway is multiplied by `sin²(πp)` (where `p` is progress through the season), so it is zero at every boundary.
- Every particle (snowflakes, snow clumps, petals, leaves) is born and dies within its own clip.

Clip lengths are set per season in `CLIP_SECONDS` (winter 2.2s, spring 2.8s, summer 1.9s, fall 3.2s) and rendered at 60fps. Durations are deliberately uneven.

### Seasons

`stateAt(tau)` returns the parameters for a moment: leaf density, palette mix, buds, blossoms, snow, sway and shadow size.

- **Winter:** bare branches gather snow, then a gust shakes it off as falling clumps with a damped sway.
- **Spring:** buds appear, then light green leaves grow in and pink blossoms open.
- **Summer:** the canopy fills to full density, shifts to deep greens, and the blossoms fade.
- **Fall:** clumps turn orange one by one, then the leaves thin out and drop, and the shadow shrinks back.

### Art

- 192×192 canvas, transparent background, no outlines, no ground besides a faint shadow.
- All colors are Tailwind v4 palette values.
- The trunk and branches are generated recursively from a seeded RNG, so the tree is the same every run.
- The canopy is 15 round clumps in back, mid and front layers. Each is shaded as a sphere lit from the top left, with rim highlights and ambient occlusion, and textured with value noise.
- Color ramps are quantized with a 4×4 Bayer ordered dither, which keeps the pixel art look while blending between palettes.

### Encoding

Frames are scaled 4× with nearest neighbor to 768×768. Keeping each art pixel a 4×4 block lines it up with 4:2:0 chroma subsampling, so colors stay crisp.

Two formats are needed for transparency:

- **WebM, VP9 with `yuva420p`:** for Chrome.
- **MP4, HEVC with alpha via `hevc_videotoolbox`, tagged `hvc1`:** for Safari, which drops the alpha channel from WebM.

`TreeLoop.astro` picks between them by user agent and plays the clips in order, switching on each `ended` event.

# Recovery provenance

## Title media

Higgsfield Marketing Studio Image, with the previously supplied concept and approved-direction title keyframe as inputs, generated a native 3840×2160 desktop master and a 1520×2688 portrait master. Kling Video v3.0 Pro image-to-video generated the native 1920×1080, 24 fps silent loop. Source files, exact prompts, model names, request receipts and hashes are in `higgsfield/`; none of these production masters ships in `game/`.

Schemas were checked against the provider's official API reference: https://open.higgsfield.ai/models/marketing-studio/image/api-reference and https://open.higgsfield.ai/models/kling-video/v3.0/pro/image-to-video/api-reference. Grok's documented 2K limit was not presented as native 4K. No Atlas-generated assets were used.

Desktop AVIF is 3840×2160; WebP fallback is 2560×1440. The portrait AVIF is 1080×1920. Local avifenc encoded the AVIFs; Chrome canvas encoded WebP. ffmpeg encoded the provider's native 1080p video to VP9 WebM and H.264 MP4, trimmed to 6.000 seconds, with audio explicitly removed. The media audit records exact sizes, dimensions, codecs and durations. No type or interface is baked into these files.

## Gameplay imagery and code

The retained distant archive matte was generated through Higgsfield in the preceding visual pass; its original receipt remains under `production/visual-lock/`. Tutorial images are direct screenshots of the actual browser game during pull, install and restored-bridge states. They are not concept renders passed off as gameplay. Tutorial headings, copy, progress, arrows and controls are separate HTML/CSS.

All interactive 3D geometry is code generated through the official 404 candidate/verification process. The selected asset sources and exact SHA-256 hashes are in `selected-verification/`. Mara and the compact platform have fresh three-candidate sheets; retained asset families keep their prior receipts. Original local procedural rendering effects include floor grain, etched inlays, soft contact shadows, halos, light channels, glyph projections, glass glow and dust.

## Audio and fonts

Retained music and SFX: original deterministic additive/modal synthesis, not third-party recordings. Existing receipts: `production/audio/synthesis-receipt.json` and `production/audio/visual-lock-receipt.json`. New recovery UI, energy and segment cues: `tools/recovery-audio.mjs` and `audio-receipt.json`. Local MP3, volume buses and master limiter; browser AudioContext unlocks only from a real gesture. Sound quality still needs the user's listening approval.

Cormorant Garamond and Manrope remain under their included SIL OFL licenses. Recovery WOFF2 subsets were generated locally with fontTools and Brotli; original TTF files are retained. Three.js remains pinned at 0.180.0 under MIT. `scripts/build-three.mjs` builds the used exports with pinned esbuild 0.25.10; original pinned vendor sources and license comments remain intact. Codex authored implementation, synthesis, procedural effects and production tooling.

## Evidence boundaries

Browser checks use desktop Chrome with an Apple M5 GPU and emulated phone viewports/touch/network/CPU. They are not physical-phone tests. The jam harness runs against localhost; no public deployment or live-host gate is claimed. No comparison video was available in the supplied files. Structural 404 passes are not user visual approval.

The direct recording and receipt are versioned. Its 761 original JPEG screencast frames are retained locally in `production/recovery/recording/frames/` (ignored; exact frame count and encoded dimensions are in the recording receipt), rather than inflating repository history. The capture script regenerates the timing manifest and encoded review film.

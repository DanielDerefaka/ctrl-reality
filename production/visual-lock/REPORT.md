# Boot Atrium visual review — 24 September 2026

**Ready for user comparison review. Not approved, and not represented as a completed visual lock.** Feature development stops here. The user decides whether the scene is accepted; no Clock Gallery, Kernel Collapse, PAUSE or UNDO gameplay was added.

[Open the screenshot gallery](review.html) · [Comparison board](comparison-board.png) · [Exact runtime 404 verification](selected-verification/_verify/report.json)

## Required end report

| Item | Result |
|---|---|
| 1. Branch and commit | `feature/boot-atrium-visual-lock`. The focused `ui: rebuild Boot Atrium for visual review` commit contains this report; its exact hash is returned in the task's final response. |
| 2. Greybox tag | `ctrl-reality-greybox-v2` → `8d64785`. Screenshots and the eleven-point rejection critique remain under `production/discarded-directions/greybox-v2/`. Earlier game history also remains at `archive-before-ctrl-reality`. |
| 3. Gameplay preserved | Fixed-step movement, keyboard/pointer/touch input, card proximity checks, install/retrieve, bridge collision/state, checkpoint/reset, existing three fragments, completion/results, menus, settings, accessibility and read-only telemetry. `game/src/model.js` and its tests are unchanged. |
| 4. Changed | Visible Mara, eleven selected asset families, archive composition, one distant Higgsfield matte plane, physical socket/latches/card, sequential bridge segments, floor reflections/engraving, light hierarchy, 52° desktop/54° portrait camera and architectural camera collision. HUD type, spacing and contextual wording; scoped Atrium sound feedback. |
| 5. Atlas outputs used | None. The explicitly approved private project exists, but agent requests did not produce usable assets. The HTTP500 and uncertain later network request are documented in `production/TOOLING_LOG.md`; no successful Atlas generation is claimed. |
| 6. Higgsfield outputs used | Retained title keyframe, silent six-second title loop and Mara angle references under `production/higgsfield/`. New clean object references and archive matte under `production/visual-lock/references/`. Runtime uses `game/media/environment/archive-matte.webp` (259,220 bytes). The alternate archive-depth image was reviewed as a candidate but is not shipped or loaded. |
| 7. Mara status | Selected `01-lofted-couture`, 1.80m; closed ceramic helmet/mask, black curved coat panels, narrow bronze seams and a cyan glove. Named limb and coat pivots remain animated. Gameplay, front, side/walk and rear/drag views were inspected. It is a simplified stylized interpretation and still falls short of the reference's fine costume/hand detail; user approval is pending. |
| 8. 404 process | Three independent constructions for each of eleven families in `production/asset-receipts/`, comparison sheets and selection/rejection notes. Final exact runtime modules: `production/visual-lock/selected-verification/`. Official verifier: **11/11 clean**. Initial rejected candidates and later rejected visual passes are retained. Official recipe self-test also passed. No connected 404 MCP was available; the documented official agent-authored path was used. |
| 9. Environment paths | `game/assets/production/{archive-arch,floor-ledge,bronze-trim,broken-fragment,socket-pedestal,bridge-segment,kernel-assembly,archive-mechanism,foreground-frame,card-housing}.js`. `selected-assets.json` records exact hashes and triangle counts. All physical assets are procedural Three.js modules; no imported meshes. |
| 10. Title video | `game/media/video/mara-title-loop.mp4`, **142,473 bytes**, approximately 6.04s; no audio stream. Poster `game/media/video/mara-title-poster.webp`, **94,210 bytes**. Actual paths are confirmed in the media audit below if browsing by filename. |
| 11. Audio | `game/media/audio/music/`: title loop and archive ambience, **1,142,010 bytes combined**. `game/media/audio/sfx/`: **179,019 bytes total**, including revised footsteps, pickup, drag hum, valid pulse, socket lock, bridge assembly/completion, checkpoint and pause sounds. Exact files/sizes below. Original modal synthesis and filtered contact noise; no third-party samples. Listening/mix approval is outstanding. |
| 12. Desktop screenshots | `boot-atrium/desktop-{title,enter,hud,drag,bridge-complete,pause}.png`; `desktop-socket-accept.jpg`, `desktop-bridge-half.jpg`. Actual 1440×900 browser output. |
| 13. Portrait screenshots | Corresponding `mobile-…` files, actual 390×844 viewport with touch emulation. The gallery pairs every state. |
| 14. Draw calls | Completed crossing: desktop **392–618**, portrait **369–576**, counting actual scene, shadow and occasional reflection passes. Reflection updates every third desktop/fourth portrait frame. These are not single-pass counts. |
| 15. Triangles | Completed crossing: desktop **320,466–517,910** submitted triangles/frame across passes; portrait **289,406–456,310**. Repeated reflection/shadow submissions are included. |
| 16. Transfer | Observed local Resource Timing: desktop **3,839,242 bytes**, portrait **3,843,043 bytes** for the capture route. Full uncompressed runtime **4,410,059 bytes**, below the 8.5MB target. Media sub-budgets all pass. This is localhost measurement, not a cold remote/mobile-network benchmark. |
| 17. Desktop frame rate | **59.5–60.4 FPS** across 30 samples of the completed crossing. Renderer: ANGLE Metal, Apple M5. Frame-rate sampling uses real wall time, not the simulation's capped delta. |
| 18. Physical mobile frame rate | **Not tested.** Portrait emulation on that same Mac measured 58.3–60.1 FPS; it is not evidence of phone GPU performance. |
| 19. Console errors | Final 24-check interaction gate and screenshot run recorded **zero browser exceptions**. |
| 20. Missing files | **Zero failed runtime requests** in the final interaction gate/capture route. Static check: 23 JS modules parsed, 26 local references verified; pinned Three.js files match; no forbidden mesh files. |
| 21. Largest gap from A | The actual game's hard-edged architecture and foreground materials are less richly integrated than the concept's cinematic lighting. The title retains the stronger generated atmosphere with real HTML typography. |
| 22. Largest gap from B | Mara's procedural costume, mask, fingers and coat motion lack the reference's sculptural detail and tailoring. The architecture also lacks its fine fracture/engraving detail. A structural verifier pass does not resolve these aesthetic differences. |
| 23. Ready for approval? | **Ready to review and accept or reject. Not self-approved.** The rendering workload is significant and physical-phone testing remains the largest technical risk. No further features or rooms will be built before the user's decision. |

## Evidence and limits

- `npm test`: **7/7 pass**. Original model tests preserved.
- `npm run check`: **pass**.
- `npm run media:audit`: **pass**, every configured byte budget.
- `npm run gate`: **24/24 pass**, real keyboard/mouse and CDP touch events, including invalid drops, installation, retrieval, crossing, fall/reset, checkpoint, completion, settings and pause.
- Official 404 verifier against the exact production modules: **11/11 clean**; five views inspected. Rejected candidate warnings remain in their original family reports.
- Mara projected frame height: **22.1% desktop, 21.3% portrait** at the tested camera positions.
- Observed page-ready time: 5,446ms desktop and 1,684ms portrait in this capture run; startup-to-control after the start gesture: 24ms/49.5ms. Ready timing includes asset work and Puppeteer's network-idle wait and varied during concurrent local checks; it is not a release loading-time guarantee.
- The first PNG attempt missed the brief halfway window. Final JPEGs come from an unretouched Chrome screencast and read-only animation telemetry: **49.12% bridge progress** in both halfway images; nearest telemetry samples differ from frame timestamps by under 3ms. See `timed-stage-report.json`. Earlier captures and the failed paused-debugger experiment are explicitly excluded from approval evidence.
- References A and B are crops of the single combined concept board supplied in this task. A separate B file was not available; this assumption is labeled on the comparison board.
- There is no claim of physical-device QA, headphone/speaker listening approval, official live jam-gate passage, deployment or final submission.

## Asset and tool provenance

Higgsfield: `xai/grok-imagine-image-2.0` for references/matte, `kling-video/v3.0/std/image-to-video` for the retained silent title loop. Job receipts, exact prompts and downloads remain in production. No generated text is used in the UI. No generated image replaces interactive 3D geometry.

Three.js 0.180.0, MIT, is locally bundled. Official recipe `harness/assetlib.js` and `surfaces.js` are copied into `game/src/`; import paths are local. `BufferGeometryUtils.js` and `Reflector.js` are copied from the pinned Three.js package, with local imports/comment examples. Rigid siblings merge without deleting articulated pivots. Reflector is used as a restrained low-resolution rendering effect over the code-built floor; it is not a mesh asset replacement.

Fonts are local Cormorant Garamond and Manrope with SIL OFL texts in `game/media/fonts/cormorant-LICENSE.txt` and `manrope-LICENSE.txt`. Interface text, controls, focus and responsive layout remain HTML/CSS.

Original waveform generators: `tools/generate-audio.mjs` and `tools/generate-atrium-audio.mjs`; ffmpeg/libmp3lame encoding and loudness normalization. The new sounds use damped inharmonic modes and seeded filtered contact noise. Title music unloads/crossfades out of gameplay; the archive ambience remains. Drag audio stops on release, cancellation or menu transition. Pause uses separate opening/closing sounds.

## Exact shipped audio/video files

| File | Bytes |
|---|---:|
| `game/media/audio/music/boot-atrium.mp3` | 661,005 |
| `game/media/audio/music/title-archive.mp3` | 481,005 |
| `game/media/audio/sfx/bridge-complete.mp3` | 10,221 |
| `game/media/audio/sfx/bridge-reveal.mp3` | 12,333 |
| `game/media/audio/sfx/checkpoint.mp3` | 12,717 |
| `game/media/audio/sfx/control-drag.mp3` | 16,749 |
| `game/media/audio/sfx/control-invalid.mp3` | 3,885 |
| `game/media/audio/sfx/control-pickup.mp3` | 7,149 |
| `game/media/audio/sfx/control-retrieve.mp3` | 9,453 |
| `game/media/audio/sfx/control-socket.mp3` | 12,717 |
| `game/media/audio/sfx/failure-fracture.mp3` | 3,309 |
| `game/media/audio/sfx/failure-reverse.mp3` | 10,221 |
| `game/media/audio/sfx/footstep-1.mp3` | 3,501 |
| `game/media/audio/sfx/footstep-2.mp3` | 3,501 |
| `game/media/audio/sfx/footstep-3.mp3` | 3,501 |
| `game/media/audio/sfx/footstep-4.mp3` | 3,501 |
| `game/media/audio/sfx/footstep-5.mp3` | 3,501 |
| `game/media/audio/sfx/fragment.mp3` | 11,181 |
| `game/media/audio/sfx/pause-close.mp3` | 4,653 |
| `game/media/audio/sfx/pause-open.mp3` | 4,653 |
| `game/media/audio/sfx/socket-valid.mp3` | 6,381 |
| `game/media/audio/sfx/ui-confirm.mp3` | 5,997 |
| `game/media/audio/sfx/ui-hover.mp3` | 3,117 |
| `game/media/audio/sfx/ui-tick.mp3` | 2,157 |
| `game/media/audio/sfx/victory.mp3` | 24,621 |
| `game/media/video/mara-title-loop.mp4` | 142,473 |
| `game/media/video/mara-title-poster.webp` | 94,210 |

## Stop and next decision

Review `review.html` and the comparison board. The next instruction should accept this visual direction or identify the specific Mara, architecture, lighting, camera or typography changes to make. This milestone does not authorize another room. The largest risk is the difference between desktop emulation and a real phone under the current multi-pass rendering load.

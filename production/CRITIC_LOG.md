# Zero Hour visual critic log — 2026-09-23

Review uses actual browser frames under `zero-hour/screenshots/` and keyboard/mouse/touch automation. These are prototype foundation verdicts, not a commercial-art approval. No fresh-player judgment, physical-phone comfort assessment or audio audition was performed.

## Failures, changes and recaptures

1. The preserved floor was distant, static, shallow and telemetry-like. Replace the single circular view with shoulder camera, live Command Bay, composed Skybridge and Security Spine, and semantic menus/HUD. Compare `floor-build/desktop-1440x900.png` with `skybridge-desktop.png` and `menu-desktop.png`: clearly different game identity and perspective. Final geometry is still absent.
2. Initial mobile HUD notification collided with echo information; health crowded the lower subject. Move notification below echo status, compact health against the left edge and retain a clear center. Recapture `skybridge-mobile.png` and `recording-mobile.png`: essential text is separated and controls stay below/to the right of the ordinary player silhouette.
3. Initial operative held the weapon too close to the torso silhouette. Repose the right arm and expose the carbine at the side. Recapture `skybridge-desktop.png` and `skybridge-mobile.png`: weapon separates visibly, but the block mannequin remains rigid and is the largest visual weakness.
4. At the right-hand crossfire position, camera wall retraction enlarged the hero and obscured the sentinel. Fade nearby hero materials. Recapture `crossfire-shield-broken.png`: sentinel/hit marker remain readable through the hero. This mitigates obstruction; the close-range scale change and transparency still need refinement.
5. An early phone capture after switching an existing desktop tab into mobile emulation reloaded to the menu. Rename it `round1-resize-returned-to-menu-mobile.png`; never describe it as gameplay. Capture the actual phone flow after tapping through menus (`skybridge-mobile.png`).
6. Operations capture during the 0.22-second screen fade looked washed out. Preserve `round3-operations-midtransition-mobile.png`; wait for UI transition completion before screenshot. `operations-mobile.png` is the corrected stable screen. This was a capture-timing correction, not a fabricated rendering fix.
7. Browser crossfire run exposed pointer-capture errors while pointer lock was active. Preserve `FAILURE.png` and failed JSON/output; guard pointer capture under lock. Final 34-check run and crossfire frame pass with zero console/page errors.

## Requested visual claims

| Claim | Observed result and limit |
|---|---|
| Player immediately readable | Foundation pass at normal range: white silhouette, violet backpack, ~23% gameplay height. Primitive anatomy/pose is not final. |
| Third-person action camera | Shoulder view and mouse/right-drag control work; normal/aim FOV verified. Near-wall fade remains abrupt. |
| Intentional functional menu | Live Command Bay plus working Operations, How, Settings, Credits; touch menu flow tested. |
| Designed HUD | Cyan/amber/violet hierarchy and real ammo/echo/target state replace debug labels. Mobile overlap corrected. |
| World depth beyond one platform | Foreground rails, subject, vanishing-point bridge, distant tower layers and illuminated doorway visible. Tower shapes remain repetitive. |
| Meaningful motion in every captured frame | Partial: live menu drift/idle, drone bob, player movement, recoil, replay and effects exist; crossfire frame captures active hit/echo state. Static screenshots cannot prove motion in every frame, and stationary menus/results are deliberately readable. No claim that all frames meet a cinematic motion standard. |
| Foreground/subject/background | Present in normal gameplay and menu. Tight wall views reduce depth and require more composition work. |
| Immediate weapon feedback | Actual firing consumes ammo and damages targets; muzzle/tracer/hit/recoil feedback present, death tested. Feel and sound need human playtest. |
| Mobile controls leave subject visible | Corrected 390×844 gameplay screenshot has movement/fire/echo/dodge controls outside ordinary subject; arbitrary camera positions and real devices remain unproven. |
| Distinct from old floor | Pass: behind-player linear sci-fi spaces and new screen hierarchy, not top-down circular clockwork room. |

## Remaining visual work

Rigid temporary operative, flat box architecture, sparse material detail and missing authored animation/rain/temporal-collapse dressing prevent any commercial-quality claim. The damaging foundation issues (distant camera, unreadable weapon, overlapping HUD and close-wall target obstruction) were addressed and recaptured. Further silhouette, materials, animation and atmosphere should use the verified Section 1 production workflow rather than polishing temporary primitives into final assets.

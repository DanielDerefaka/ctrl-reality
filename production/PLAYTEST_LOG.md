# Playtest Log

## Session metadata

- Date/time WAT:
- Build commit:
- Live/local URL:
- Tester initials or anonymous ID:
- Prior knowledge: none / heard pitch / saw earlier build
- Device, OS, browser:
- Input: touch / keyboard / both
- Observer:

## First three minutes — no coaching

| Event | Time | Observation/quote |
|---|---:|---|
| Finds Start |  |  |
| Produces movement |  |  |
| Finds ACT |  |  |
| First rewind |  |  |
| Predicts what rewind does |  |  |
| Understands echo purpose |  |  |
| Completes Chamber 1 |  |  |

## Errors and friction

| Type | Count | Exact context | Game fault, plan fault, unclear |
|---|---:|---|---|
| Mis-tap |  |  |  |
| Accidental rewind |  |  |  |
| ACT miss |  |  |  |
| Camera/readability confusion |  |  |  |
| Mechanism cause/effect confusion |  |  |  |
| Performance issue |  |  |  |

## Post-play questions

1. Explain the game in one sentence:
2. What did your past selves contribute?
3. Which symbol/control was unclear?
4. What felt unfair?
5. Most memorable moment?
6. Would you replay for a better medal? Why?

## Triage

- P0 blocker:
- P1 friction:
- Highest-impact fix:
- Retest step:
- Decision log link:
- Fix commit:

## Milestone 01 automated browser run — 2026-09-23T00:56:55+01:00

- Tester: Codex browser automation and screenshot inspection; not a human playtest.
- URL: http://127.0.0.1:4173/game/; initial milestone working tree (no prior commit).
- Host: macOS arm64 / Chrome/153.0.8010.36; GPU: ANGLE (Apple, ANGLE Metal Renderer: Apple M5, Unspecified Version).
- Viewports: 390×844 mobile touch, 844×390 orientation check, 1365×768 desktop.
- Actual browser input: Start tap/click, CDP touch drags/cancel, two fingers, captured release outside controls, real keyboard events, actual foreground/background tabs.
- Final smoke: **42 passed, 0 failed**; console/page errors **0**, failed/HTTP-error requests **0**, requests outside game folder **0**.
- First run: **16 passed, 1 failed** at multi-contact release. Driver error fixed; original JSON/output/failure screenshot preserved as `attempt-01-*`.
- Unit tests: **23 passed, 0 failed**, including 12 new timing/input/collision tests.
- Measured phone-emulation sample: **24 draw calls**, **7160 triangles**, **2054151 transferred bytes**, **171.5 ms ready**, **60.0 FPS** on desktop Apple M5 GPU. Not 4G throttled; not a phone performance claim.
- Temporary floor and boundary screenshots visually inspected: player visible at spawn and right rim, central room unobstructed by controls, fixed camera, plain temporary props. Hero is small versus final art-direction target; no final-art claim.
- Safe area tested only with injected 47px top/34px bottom CSS values; real notch/browser chrome untested.
- Physical phone, mobile Safari, real device zoom behavior, real cellular network and live URL: **not tested**.
- Replay, plate activation, vault logic and pickup: deliberately inactive; not tested as gameplay.
- Largest current risk: real-phone touch/performance and small hero readability are not yet validated.
- Next session: `prompts/02_CORE_REPLAY_MECHANIC.md`; keep a real phone check early.

## 2026-09-23 — Zero Hour automated evaluation

- Tester: Codex automation plus actual screenshot inspection; not a fresh-player or physical-device playtest.
- Local URL: http://127.0.0.1:4173/game/; branch feature/zero-hour-vertical-slice, working tree subsequently committed as `pivot: establish Zero Hour third-person presentation foundation`.
- Chrome/153.0.8010.36 on desktop macOS/Apple M5; desktop 1440×900, emulated touch 390×844.
- Units: 35 passed / 0 failed (23 retained plus 12 new). Static: 24 modules / 25 local references verified. Browser: 34 passed / 0 failed; page/console errors 0; failed or missing requests 0; requests outside local game 0.
- Real-input proof: fire at and defeat scout; record/deploy/expire echo; reload; walk to airlock and interact; record left attack; walk right; deploy echo and fire; Security Spine sentinel shield becomes false and synchronized count becomes 1. No state injection.
- Touch proof: menu/Operations/briefing entered through taps, joystick moves/cancels, right drag changes camera, Fire releases outside button, Echo begins recording, Pause works. Essential tested buttons >=64px. No gameplay page scroll or zoom observed. Full shield proof was desktop input, not a physical-phone crossfire claim.
- Three repeated scene cycles retained one root and a stable geometry count. This checks bounded lifecycle behavior, not a complete long-duration heap/thermal audit.
- Sample metrics: Command Bay 106 draws / 1272 triangles; mobile Skybridge 76 draws / 1364 triangles; shield-break frame 96 draws / 1604 triangles. Local ready: 138.2ms desktop and 74.7ms phone emulation; sampled FPS about 60. These are individual desktop-host snapshots, not peak budgets or phone measurements. Pivot transfer bytes not measured.
- Normal hero framing ~23% of viewport height. Near-wall crossfire frame ~69% due camera retraction, with transparent hero to keep the sentinel visible; further polish needed.
- Results accurately show UNRANKED, core unsecured and damage taken zero; no enemy offense exists yet. No boss/extraction or complete mission claimed.
- Next: prompts/09_ZERO_HOUR_SECTION_1_PRODUCTION.md. Main risk is target-only combat and unproven physical-phone aim/comfort, not current automated correctness.

## 2026-09-23 — frozen prototype regression only

Re-ran the existing Zero Hour browser suite with separate evidence output: 34 passed / 0 failed, 0 page/console errors, 0 missing/failed requests, 0 outside-game runtime requests. Actual mouse/keyboard/touch emulation used; no physical device. Screenshots under production/midnight-pipeline/prototype-browser/screenshots/. This is preserved prototype regression evidence, not a Midnight Express playtest. Main game unchanged. No new Nyra art exists to evaluate.

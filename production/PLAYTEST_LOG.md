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

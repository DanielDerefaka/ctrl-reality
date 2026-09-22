# SECOND HANDS: A Clockwork Heist

Milestone 01 is a **temporary floor prototype**, not a playable replay puzzle or a submission build.
One real tap/click starts one room. Keyboard and pointer/touch controls drive a circular actor through a fixed 60 Hz simulation. ACT and REWIND provide press feedback only. The loop timer, score and puzzle telemetry stay at zero/false.

## Run

Node **22.12 or newer** is required by the pinned browser test tooling (tested on Node 24.15.0).

```sh
npm install
npm run setup
npm test
npm run check
npm run serve
```

Open http://127.0.0.1:4173/game/ . With that server still running:

```sh
npm run smoke
```

`npm run setup` copies pinned Three.js **0.180.0**, its required core module, and MIT license into `game/vendor/`. The runtime uses only local files. `npm ci` is also supported by the committed lockfile. `npm run check` parses modules, checks local dependencies, verifies vendor bytes, and rejects mesh files. The server exposes only `game/`; for a physical phone on the same LAN, use this computer's LAN IP and port 4173.

## Controls

- Phone/pointer: joystick, ACT, REWIND. Buttons capture their pointer until release/cancel.
- Laptop: WASD or arrow keys; E or Space for ACT feedback; R for REWIND feedback.
- Blur/backgrounding clears held input and pauses; returning resumes without catch-up.
- The camera stays fixed; the player circle remains inside radius 6 and collides with the temporary gate/pedestal.

All 3D content is labelled **PROTOTYPE_ONLY**. Existing recorder, replay, reset, audio and puzzle-gate scaffold files remain for later milestones, but replay/audio are not imported by the active runtime. `npm run gate` is the existing future replay-puzzle gate and is **not expected to pass this floor**; use `npm run smoke` now.

## Evidence and scope

See [the milestone report](production/MILESTONE_01_REPORT.md), [tooling](production/TOOLING_LOG.md), [decisions](production/DECISION_LOG.md), and [playtests](production/PLAYTEST_LOG.md). Real browser CDP touch input is automated emulation, **not a physical-phone test**. All measured performance is unthrottled localhost on a desktop GPU, not a live 4G jam gate.

Next: `prompts/02_CORE_REPLAY_MECHANIC.md`. Production asset generation and release gates remain later work.

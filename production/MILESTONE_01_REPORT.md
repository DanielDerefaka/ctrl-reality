# Milestone 01 — mobile floor build

Local first-milestone functionality is implemented and automated/browser checks pass. This is not the finished game or a jam gate pass.

## Changes

- Runtime: `game/main.js`, `game/config.js`, `game/core/fixed-step.js`, `game/core/math.js`, `game/core/telemetry.js`, `game/systems/movement.js`.
- Input: `game/input/input-manager.js`, `game/input/touch-controls.js`.
- Presentation: `game/index.html`, `game/styles.css`, `game/favicon.svg`, prototype floor material and labelled spawn ring in `game/assets/prototype-assets.js` / `game/levels/chamber-01.js`.
- Setup/check/server: `package.json`, `package-lock.json`, `scripts/copy-three.mjs`, `scripts/check.mjs`, `scripts/serve.mjs`, local `game/vendor/` module/core/license.
- QA: `tests/floor.test.mjs`, `tools/floor-smoke.mjs`, `production/evidence/floor/`.
- Docs: README, tooling/decision/playtest logs, this report, credential ignores.
- Original pack docs, existing `tools/second-hands-gate.mjs`, pure replay modules/tests and UI reference preserved. No original production-pack changes and no starter deletion.

## Verification

- Unit suite: **23 passed / 0 failed**, baseline was 11/0.
- Browser smoke: **42 passed / 0 failed**; prior failed driver attempt preserved (16/1).
- Static: **20 modules parsed; 25 references verified**, no missing/escaping dependencies or mesh files.
- Organizer `npm run selftest`: **exit 0**, expected broken fixtures rejected, clean fixtures accepted, **7/7 loader checks**.
- Dependencies: final npm audit **0 vulnerabilities**, Three.js pinned 0.180.0, Puppeteer pinned 25.11.0.
- Fresh-copy install/setup/test/check receipt: `evidence/floor/clean-install-output.txt`.
- No 404 MCP tools exposed; names/schemas/authentication test unavailable. Full actual inventory is in `evidence/floor/mcp-inventory.json`.
- Exact build/test commands and raw receipts: [TOOLING_LOG.md](TOOLING_LOG.md).

## Current behavior and measurements

One actual tap or click starts the room. A normalized analogue joystick and WASD/arrows move immediately. ACT/REWIND show press feedback only. Device switching, pointer release/cancel, captured release, simultaneous ACT/movement, blur and visibility reset passed. Whole-circle room containment and the closed gate passed. Fixed 60 Hz simulation is separate from rendering. No recording/rewind/replay/audio system is imported into the active runtime.

Measured unthrottled localhost at 390×844, Chrome on desktop Apple M5: **24 draws, 7160 tris, 2054151 bytes transferred, 171.5 ms to ready, 60.0 FPS**. Zero console/page errors, zero missing requests, zero outside-game runtime requests.

Example telemetry from the browser receipt:

```json
{
  "ready": true,
  "started": true,
  "mode": "playing",
  "pos": [
    5.272865941739066,
    2.2170441494134017
  ],
  "fps": 60.00521784502995,
  "speed": 0,
  "score": 0,
  "over": false,
  "draws": 24,
  "tris": 7160,
  "chamber": 1,
  "loopTime": 0,
  "echoCount": 0,
  "plateActive": false,
  "vaultOpen": false,
  "jewelTaken": false
}
```

Other fields: readyMs, elapsedTime (floor simulation elapsed time, not loop time), inputX/Y, actDown, rewindDown, yaw, fixed camera pose. `window.__START__` exists and shares the button's start path; browser acceptance used the button.

Six actual game screenshots: `evidence/floor/00-title-390x844.png` through `05-room-boundary-390x844.png` (see `smoke-result.json` for names). These are not UI mockups. A dimmed frame may show the deliberate blur/pause state during browser focus transitions.

## Limitations and next step

Physical phone, Safari, true device safe areas/zoom, live 4G performance, public deployment and official live jam gate are untested. The full-room floor framing makes the hero smaller than the final art-lock target; it is visible in the tested views but needs future composition work. The 404 MCP is unavailable; final assets were not generated. No public remote is configured.

Largest current risk: **actual phone input and readability have only been emulated**.

Ready to proceed with **`prompts/02_CORE_REPLAY_MECHANIC.md`** after this milestone commit. Stop here this session. Remaining P0 includes deterministic replay, echo/plate/door/jewel puzzle, chamber configurations, verified production assets, physical-device QA, public history/deployment and the live official gate. No claim that the full definition of done is met.

Commit message: `prototype: establish mobile floor build and truthful telemetry`. Git was on main with no commits at intake; the final commit records this initial source and all evidence. The session's final response provides its resulting SHA.

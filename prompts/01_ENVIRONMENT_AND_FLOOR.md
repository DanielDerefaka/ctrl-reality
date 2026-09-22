# Session 01 — Environment, One-Tap Flow, and Floor Prototype

## Objective

Create the smallest truthful browser build that starts from a real tap, moves responsively with touch and keyboard, exposes telemetry, and renders one intentionally temporary clockwork test room.

## Read first

- `AGENTS.md`
- `docs/02_OFFICIAL_RULES_AND_CONSTRAINTS.md`
- `docs/10_UI_UX_SPEC.md`
- `docs/11_TECHNICAL_ARCHITECTURE.md`
- `docs/14_MOBILE_PERFORMANCE_AND_RENDERING.md`
- organizer `GAME.md`, `docs/gates.md`, and `docs/traps.md`

## Tasks

1. Audit the starter scaffold. Preserve useful logic, but do not trust it without tests.
2. Pin a compatible Three.js version in `package.json` and copy the module into `game/vendor/` through a repeatable setup script.
3. Create a static server command and a test command.
4. Implement:
   - title screen with one real `START HEIST` button,
   - 390 × 844 portrait-safe UI,
   - virtual joystick,
   - ACT and REWIND buttons,
   - WASD/arrow movement,
   - E/Space act,
   - R rewind,
   - pause on visibility loss,
   - fixed 60 Hz simulation,
   - simple circular player collision against chamber boundaries,
   - fixed isometric camera that frames the player at readable size,
   - temporary primitives clearly labelled `PROTOTYPE_ONLY`.
5. Create truthful telemetry with at least:
   - `ready`, `started`, `mode`, `pos`, `fps`, `speed`, `score`, `over`, `draws`, `tris`,
   - `chamber`, `loopTime`, `echoCount`, `plateActive`, `vaultOpen`, `jewelTaken`.
6. Set `window.__READY__ = true` only after runtime assets and controls are initialized.
7. Expose `window.__START__()` as a test helper that invokes the same code path as the button, but keep the production path as a real user tap.
8. Add unit tests for fixed-step timing, input normalization, and collision helpers.
9. Add a minimal browser smoke script if the local environment supports it.
10. Log the exact toolchain and results.

## Floor room layout

- Circular play floor, radius 6 m.
- Spawn at `(0, 4.5)` facing inward.
- Pressure plate at `(-2.6, 1.8)`.
- Closed gate centered at `(0, 0.4)`.
- Jewel pedestal at `(0, -3.7)`.
- Keep camera fixed. Do not implement camera rotation.

## Acceptance checks

- [ ] `npm install` and setup succeed from a clean checkout.
- [ ] A real tap/click starts the scene.
- [ ] Touch movement does not scroll or zoom the page.
- [ ] Joystick vector is normalized and returns to zero on release/cancel.
- [ ] ACT and REWIND visibly respond to press/release.
- [ ] Keyboard and touch can be switched without stale input.
- [ ] Player remains inside the circular room.
- [ ] Browser console has no errors.
- [ ] `__READY__`, `__START__`, and `__GAME__` exist and are truthful.
- [ ] Tests pass.
- [ ] One screenshot at 390 × 844 is stored as floor evidence.

## Do not do yet

No recording, echoes, production assets, audio polish, extra chamber, medals, or visual critic work.

## Commit

Suggested commit:

```text
prototype: establish mobile floor build and truthful telemetry
```

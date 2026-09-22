# Session 03 — Game-Specific Automated Gate

## Objective

Build a deterministic automated proof that the defining mechanic works through real browser input. A simple page-load or forward-walk test is not sufficient.

## Read first

- `docs/15_QA_AND_CUSTOM_GATE.md`
- organizer `docs/gates.md`
- organizer current playtest harness source and CLI usage

## Gate requirements

Use the organizer browser/harness facilities where documented. Extend them rather than inventing incompatible infrastructure.

The custom gate must:

1. Start a static server or accept a live URL.
2. Emulate a 390 × 844 Android-style viewport.
3. Apply the organizer’s required network/device conditions when supported.
4. Capture console errors, page errors, unhandled rejections, failed requests, and HTTP 404s.
5. Tap the real title button.
6. Drive the virtual joystick through real pointer/touch events.
7. Move the player onto the pressure plate.
8. Press the real REWIND control.
9. Wait for rewind completion.
10. Assert an echo exists.
11. Assert the echo reaches and activates the plate.
12. Assert the gate reports open.
13. Move the current player through the gate.
14. Press the real ACT control at the jewel.
15. Assert jewel pickup and chamber completion.
16. Capture 6–8 screenshots while the scene is moving, including at least one visible echo and one open gate.
17. Record ready time, transferred bytes, draw calls, triangles, errors, and the final relevant telemetry.
18. Exit non-zero on any failed assertion.
19. Write a JSON verdict and a Markdown summary into `production/gate-runs/`.

## Reliability design

- Prefer state-aware waypoint driving over fixed sleeps.
- Time out every wait with a useful message.
- Use telemetry only for assertions and navigation feedback, not to mutate game state.
- Never call private game functions to place the player or force mechanisms.
- `window.__START__()` may be used only in a separate diagnostic test. The submission proof must tap the visible button.
- Make selectors stable with explicit `data-testid` attributes.
- Include the tested URL and commit SHA in the result.

## Tests

Prove the gate fails when:

- echo creation is disabled,
- plate presence is ignored,
- the door never opens,
- jewel pickup is disabled,
- a console error is thrown.

These negative tests may be implemented through test-only query flags excluded from the production entry point, or through module-level unit fakes. Do not ship a hidden cheat API.

## Acceptance checks

- [ ] The full gate passes three consecutive times locally.
- [ ] Each negative case fails for the expected reason.
- [ ] Filmstrip frames show actual movement and the unique mechanic.
- [ ] Output is stored without manual alteration.
- [ ] The gate can target both localhost and an HTTPS live URL.

## Commit

```text
test: add defining-mechanic mobile gate
```

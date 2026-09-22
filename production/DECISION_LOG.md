# Decision Log

Record decisions when they are made. Do not rewrite earlier rationale after seeing the outcome.

| Date/time WAT | Decision | Options considered | Evidence/rationale | Consequence | Commit |
|---|---|---|---|---|---|
| 2026-09-22 | Use embodied replay agents as the core mechanic | shooter, tower defence, live generation spectacle, replay-agent puzzle | visible field already contains combat/timing/resource games; replay agents create a distinct interaction and work with three controls | prioritize deterministic recording and reset over content volume | design baseline |
| 2026-09-22 | Build one vault with three configurations | three unique large levels, one endless room, one room/three configurations | asset coherence and schedule benefit from reuse; judging rewards finish over raw size | reuse P0 asset family and lighting rig | design baseline |
| 2026-09-22 | Fixed camera and analytic collision | free camera, physics engine, fixed diorama | improves phone control, composition, replay determinism, and performance | no camera rotation or mesh collision | design baseline |

## Entry template

| Date/time WAT | Decision | Options considered | Evidence/rationale | Consequence | Commit |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Milestone 01 — 2026-09-23T00:56:55+01:00

- Work only in `/Users/dx/Documents/second-hands`, already bootstrapped on main. No nested starter exists here; root files already contain its content. No copy/reinitialization was needed, and the original production pack was not modified.
- Preserve dormant recording/replay/audio helpers and existing tests. Disconnect them from the active runtime to honor the user's explicit first-milestone scope. ACT/REWIND only show press feedback; loop/score/objective fields remain zero/false.
- Use a fixed 60 Hz clock with at most five catch-up steps; FPS uses the **unclamped** real interval. Reset the clock and all input on blur/visibility loss.
- Keep the circular floor radius 6, spawn (0,4.5), plate (-2.6,1.8), gate (0,0.4), pedestal (0,-3.7). Circle/AABB blockers stay separate from visual geometry. Immediate movement uses 4.2 m/s; yaw eases separately.
- Last-used movement device takes ownership. Pointer IDs/capture isolate simultaneous fingers. E/Space/pointer ACT are independently held sources.
- Fit the whole traversable room with a fixed 40-degree camera. This floor prioritizes visibility and boundary testing. Its hero is about 30–35 CSS pixels high on phone, below the production art-lock 12–18% frame-height aspiration; camera/hero composition remains a later visual risk, not a claimed production pass. Used the existing palette's lacquer highlight for a readable temporary floor.
- Keep Three.js pinned to 0.180.0 and copy **both** module and core plus the license. The starter copied only the module. Replace the naive URL-text scan with syntax, dependency-path and vendor-integrity checks; documentation URLs inside Three.js are not requests.
- Pin Puppeteer 25.11.0 and require Node >=22.12.0. The original 24.16.0 install reported four high findings through extract-zip; the patched dev-only dependency reports zero. No runtime Three.js upgrade.
- No 404 MCP is exposed. Read the cloned official recipe at `4effad311c5e137bca316257259fe5bffd6737de`; its self-test passes. Only temporary primitives were used; no production asset generation or external mesh service.
- The first multi-touch smoke run failed due to the driver ending the remaining contact rather than the released contact. Corrected the CDP event format using the installed Puppeteer implementation. Preserve the failed result and screenshot alongside the passing run.

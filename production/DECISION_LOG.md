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

## 2026-09-23 — user-directed Zero Hour pivot

The circular floor is a technical control, not final art. The camera is too distant; presentation is too static; the environment lacks depth; the UI feels like developer telemetry; the game does not yet communicate a premium third-person action experience. Preserve this result and its honest limitations under floor-prototype-v1. The user explicitly replaces the earlier camera, scope, identity and palette with SECOND HANDS: ZERO HOUR. No floor geometry is claimed as verified 404 production art. Desktop and 390×844 captures and the complete existing test results are preserved in production/floor-build/.

## 2026-09-23 — Zero Hour foundation decisions

- Preserve the floor at `floor-prototype-v1` (`88be3bb47c45ac16f5c4d0acb5d61affec870a5f`) and implement on `feature/zero-hour-vertical-slice`. The user-directed pivot supersedes the prior fixed-camera puzzle brief; historical documents remain available in Git and superseded planning files are labelled.
- Separate pure combat/replay rules, input ownership, scene resources and presentation under `game/zero/`. Retain the floor logic/tests for provenance; the active entry point imports only the new runtime.
- Use one fixed 60 Hz simulation, 30 Hz transform recording, timestamped events and one stored/one active echo. Crossfire requires player plus echo, angular separation and an 0.8-second window; same-actor, same-direction and late hits fail.
- Use 52°/42° shoulder framing. Normal gameplay hero height is about 23%; wall retraction can enlarge the hero, so fade it at close range to preserve the target. This is a prototype mitigation, not a final animation/camera polish pass.
- Keep one scene root, one render loop, one input listener set and owned disposal on transition. Core and Extraction are explicit unavailable configurations, not fake completed scenes.
- Use original synthesized Web Audio shot feedback and opt-in supported vibration. All geometry remains PROTOTYPE_ONLY; no production asset generator was invoked.
- Show truthful UNRANKED evaluation results with core unsecured. Health/armor HUD exists, but enemy offense, damage-taking and final mission scoring are future work.
- Browser testing caught pointer capture being requested under mouse pointer lock. Guard capture while locked and consume fire-edge/held input separately. Final real-input crossfire/browser run passes without that exception.
- The initial six-second unit boundary was 5.9999999999 from floating-point accumulation. Saturate the recording endpoint at exactly six seconds; final suite passes.
- Mobile inspection drove separation of notifications/echo panel, compact health placement, visible weapon pose and scrollable menu sheets. Preserve intermediate and failure screenshots. See CRITIC_LOG.md.
- Associated focused commit: `pivot: establish Zero Hour third-person presentation foundation` (resolve SHA from Git history; a commit cannot contain its own hash).

## 2026-09-23 — Midnight Express scope stop

The user stopped the generic drone-shooter direction and selected SECOND HANDS: MIDNIGHT EXPRESS, a non-shooting train time heist. Freeze the active game at Zero Hour commit 6002604 and preserve floor-prototype-v1 plus all captures/history. This task only audits the real toolchain and prepares a NYRA_MASK proof. No new game, enemy, weapon, full character or train asset.

The official recipe is not an MCP. No 404 server exists in the inspected configuration/session. Use the requested RunPod model route for this proof, not an unannounced agent-written fallback. Missing local credentials and model-specific account docs permit a tested scaffold but block live generation. Do not confuse offline protocol tests or verifier fixtures with real assets. User candidate approval is a hard stop before integration.

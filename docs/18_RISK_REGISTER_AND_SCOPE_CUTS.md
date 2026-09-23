> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Risk Register and Scope Cuts

## Risk scoring

- **Impact:** 1 low to 5 fatal.
- **Likelihood:** 1 unlikely to 5 likely.
- Priority is impact × likelihood.

| Risk | Impact | Likelihood | Priority | Mitigation | Trigger for cut/action |
|---|---:|---:|---:|---|---|
| Echo replay desynchronizes | 5 | 3 | 15 | fixed-step simulation, pure tests, deterministic hazards | any cross-FPS mismatch blocks art work |
| Touch controls fail on real phone | 5 | 3 | 15 | physical test early, real-touch gate, pointer-cancel handling | no chamber work until fixed |
| Asset generation takes too long | 4 | 4 | 16 | P0 batch only, reuse modules, three candidates only for key assets | cut P1/P2 after Sep 24 13:00 |
| Game looks dark/unreadable | 4 | 4 | 16 | frame claims, floor lighting check, warm/cool rig | fix floor before decoration |
| Over-scoping chambers | 5 | 4 | 20 | feature freeze Sep 23, fallback single room | fallback if Chamber 1 not gated by Sep 23 noon |
| Door/echo collision causes puzzle bugs | 4 | 3 | 12 | echoes kinematic and non-colliding, safety sensor | simplify collision to analytic blockers |
| Rewind VFX causes frame spike | 3 | 3 | 9 | pooled VFX, CSS wash, no scene rebuild | cut postprocessing |
| MCP unavailable or unclear | 4 | 2 | 8 | inspect real tools, document, official agent-written recipe fallback | continue mechanics/references; do not fake MCP |
| Production asset silently fails import | 5 | 2 | 10 | parse modules, manifest assertion, visible fatal error | block deploy until resolved |
| Deployment paths work locally only | 5 | 3 | 15 | self-contained folder, ship/live tools | run live test before official gate |
| Static cache serves mixed build | 4 | 3 | 12 | stamp imports, exact SHA, hard reload test | redeploy/stamp only, no feature change |
| Commit history looks artificial | 4 | 2 | 8 | focused commits from first hour, logs with tests | never bulk-upload final project |
| Existing/new entry overlaps mechanic | 3 | 2 | 6 | recheck PR field, emphasize demonstration programming | adjust pitch, not core unless exact duplicate |
| Audio rights/provenance unclear | 4 | 2 | 8 | procedural SFX, declared optional Atlas loop | cut questionable audio |
| Total build exceeds 10 MB | 5 | 2 | 10 | code assets, local minified Three, compressed optional audio | cut music/textures first |
| Draw calls spike from generated parts | 4 | 3 | 12 | material reuse, instancing via organizer loader | simplify/merge after attribute audit |
| UI covers play space | 3 | 3 | 9 | prototype at 390×844, safe zones | reduce chip size, hide nonessential HUD |
| Judge cannot understand first chamber | 5 | 2 | 10 | fresh-player test, three short prompts | redesign chamber before adding polish |

## Absolute scope cuts

These features are prohibited unless all submission gates already pass:

- multiplayer,
- online leaderboard,
- procedural generation,
- runtime AI/LLM,
- combat,
- stealth guard AI,
- character customization,
- inventory,
- free camera,
- more than three chambers,
- more than three echoes,
- branching story,
- voice acting.

## Ordered P2/P1 cuts

Cut from top first:

1. Clockwork bird.
2. Display-case decoration.
3. Optional chrono shard.
4. Separate music loop.
5. Unique environment dressing per chamber.
6. Pendulum as a unique art asset; reuse second-hand mechanism with different pivot.
7. Fancy result medal animation.
8. Extra lighting accents.
9. Chamber transition cinematic.
10. Third chamber as a separate layout; use third configuration in same room.

## What must never be cut

- real touch start and movement,
- deterministic recording and replay,
- at least one meaningful echo puzzle,
- clear visual distinction between current player and echoes,
- verified 404 production assets,
- self-contained deployment,
- custom mechanic gate,
- official gate,
- honest receipts.

## Decision framework

Before adding anything, ask:

1. Does this improve one of the 40/30/20/10 criteria?
2. Will a judge notice it in moving gameplay?
3. Can it be tested before the internal deadline?
4. What existing task will be removed to make room?

If there is no clear answer, do not add it.

## Kill criteria for a feature

Remove or simplify a feature when:

- it fails twice for the same structural reason,
- it cannot be exercised by the custom gate,
- it adds a new control,
- it creates a network dependency,
- it obscures the echo mechanic,
- it requires unverified production assets after asset freeze,
- it pushes deployment later than September 25 at 16:00 WAT.

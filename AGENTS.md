# AGENTS.md — SECOND HANDS

## Mission

Build and ship **SECOND HANDS: A Clockwork Heist** as a polished, mobile-first Three.js game for the 404 Game Jam. The player records 20-second attempts. Each rewind creates an embodied replay agent called a Second Hand. The player coordinates up to three Second Hands to open a clockwork vault.

The build must prioritize a memorable playable mechanic, visual coherence, originality, real mobile reliability, and honest development receipts. Do not optimize for feature count.

## Required reading before editing code

Read these files in order:

1. `START_HERE.md`
2. `docs/02_OFFICIAL_RULES_AND_CONSTRAINTS.md`
3. `docs/03_GAME_DESIGN_DOCUMENT.md`
4. `docs/05_CORE_LOOP_AND_MECHANICS.md`
5. `docs/07_ART_DIRECTION_STYLE_LOCK.md`
6. `docs/08_404_ASSET_PIPELINE.md`
7. `docs/10_UI_UX_SPEC.md`
8. `docs/11_TECHNICAL_ARCHITECTURE.md`
9. `docs/12_REWIND_ECHO_TECH_SPEC.md`
10. `docs/15_QA_AND_CUSTOM_GATE.md`
11. `docs/16_BUILD_SCHEDULE_WAT.md`
12. `docs/20_DEFINITION_OF_DONE.md`

Also read the organizer’s current `GAME.md`, `404.md`, `docs/gates.md`, `docs/traps.md`, and asset contract from the adjacent `404-game-recipe` repository. The organizer files override this pack if they change.

## Non-negotiable jam compliance

- Every shipped 3D object must be a JavaScript module constructed from Three.js code through the 404 recipe.
- Do not import or ship GLB, GLTF, FBX, OBJ, Blender, Sketchfab, Mixamo, asset-store, or other mesh files.
- Do not conceal mesh data in base64, large literal vertex arrays, JSON, or binary blobs.
- Do not copy code or assets from the organizer’s reference games.
- Use no trademarked characters, names, logos, or recognizably copied game presentation.
- Keep the game self-contained. Runtime files must not reach above the game directory.
- Preserve genuine commit history. Never squash the entire development history into one final upload.
- Declare every image, texture, audio file, model, generator, and coding agent used.
- Never fabricate a gate result, test result, physical-device result, comparison, receipt, or discarded experiment.

## 404 MCP and recipe behavior

Prefer the organizer-provided 404 MCP tools when they are connected. At the beginning of the asset phase:

1. Inspect the MCP tools available to the session.
2. Identify the actual 404 tool names and schemas.
3. Record the connection/tool names in `production/TOOLING_LOG.md`.
4. Never invent an MCP endpoint, tool name, or successful result.

If the 404 MCP is unavailable, continue mechanics, UI, testing, and reference preparation. The official recipe also permits the coding agent to write Three.js geometry directly using the same reference → three independent candidates → verification → visual selection loop. Use that compliant path only after documenting the unavailable MCP and the chosen fallback.

## Asset generation protocol

For each production object:

1. Read `docs/07_ART_DIRECTION_STYLE_LOCK.md` without modifying its style sentence or palette.
2. Use one clean reference image: one object, three-quarter view, plain background, even light, nothing cropped.
3. Generate three independent code candidates. They must use meaningfully different construction strategies.
4. Each candidate exports a function that returns a `THREE.Group` and follows the organizer asset contract.
5. Run the organizer verifier and inspect all views.
6. Choose by eye. Never choose only by triangle count or a numeric heuristic.
7. Preserve candidate source, verification sheets, selection notes, and rejection reasons.
8. Place only the selected production module in the active asset manifest.
9. Use named child groups and correct pivots for moving parts.
10. Commit the receipt with the asset.

Never substitute generic primitives directly in the final game. Primitive-only geometry is allowed only in the explicitly labeled floor prototype and must be removed or replaced before submission.

## Build order

Follow this order unless a failing test forces a temporary detour:

1. Repository, public history, environment, organizer self-test.
2. Floor prototype using temporary geometry.
3. Real-touch input on a 390 × 844 viewport.
4. Fixed-step movement and collision.
5. Record, rewind, reset, and replay.
6. One complete puzzle: echo holds a plate, current player crosses door, takes jewel.
7. Game-specific gate that proves the defining mechanic.
8. Three chamber configurations using the same core asset set.
9. P0 404 production assets.
10. Lighting, camera, UI feedback, audio, VFX, medals.
11. Visual critic rounds, phone QA, performance, deploy, official gate, submission.

Do not begin optional collectibles, elaborate story, multiplayer, procedural generation, free camera, inventory, dialogue, or runtime AI.

## P0 scope

The submission is viable only when all of these work:

- A real tap starts the game.
- A real finger controls movement on phone.
- Keyboard works on laptop.
- The player can record an attempt and rewind.
- The rewind creates a visible replay actor.
- An echo can hold a pressure plate.
- A door reacts to the plate.
- The current player can pass through and collect the jewel.
- All state resets deterministically.
- Three chambers can be completed.
- The custom gate asserts the actual echo puzzle.
- The official jam gate passes on the live URL.

## Scope cuts

When behind schedule, cut in this order:

1. Clockwork bird guide.
2. Optional chrono shards.
3. Separate music track; retain procedural audio.
4. Extra decorative props.
5. Chamber-specific environment variants.
6. Medal animation complexity.
7. Reduce from three chambers to one room with three configurations.

Never cut touch reliability, rewind readability, the echo mechanic, production asset verification, or the live gate.

## Coding standards

- Use vanilla JavaScript ES modules and Three.js.
- Keep runtime dependencies local in the final game folder.
- Use a fixed 60 Hz simulation step. Rendering may vary.
- Record actor transforms at 30 Hz and discrete interactions as timestamped events.
- Cap device pixel ratio on mobile.
- Pool frequently created VFX objects.
- Avoid allocations in the main update loop.
- Keep echo actors non-colliding and kinematic.
- Use stable object IDs for interactions.
- Keep gameplay state separate from rendered object state.
- Store one immutable baseline snapshot per chamber.
- Reset from the baseline, then replay persistent tracks.
- Use meaningful names and comments for non-obvious deterministic timing behavior.
- Add or update tests for pure logic modules.
- No console errors, unhandled rejections, silent asset failures, or missing requests.

## UI standards

- Start gameplay within one tap.
- Use three primary controls only: movement, ACT, REWIND.
- Minimum touch target: 64 CSS pixels; preferred 72–88.
- The timer, echo count, objective, and rewind availability must be readable without pausing.
- Use shape plus color for echo identity.
- Keep tutorial copy under eight words per prompt.
- Do not cover the central play space with UI.
- UI text is HTML/CSS, not 3D geometry.

## Quality evidence

Maintain these files while working:

- `production/DECISION_LOG.md`
- `production/DISCARD_LOG.md`
- `production/PLAYTEST_LOG.md`
- `production/TOOLING_LOG.md`
- `production/GATE_RUN_LOG.md`
- asset receipts under `production/asset-receipts/`
- visual critic rounds under `production/critic-rounds/`

Every meaningful task should end with:

1. tests or a browser check,
2. a concise log entry,
3. one focused git commit.

Suggested commit prefixes: `chore:`, `prototype:`, `feat:`, `asset:`, `ui:`, `audio:`, `test:`, `perf:`, `fix:`, `docs:`, `release:`.

## Status reporting

At the end of each Codex session, report:

- What changed.
- What was tested and the exact result.
- Current mobile state.
- Current draw calls, triangles, transfer size, and ready time when measurable.
- What remains P0.
- The single largest risk.
- The next recommended prompt from `prompts/`.

Do not claim “done” while any item in `docs/20_DEFINITION_OF_DONE.md` is false.

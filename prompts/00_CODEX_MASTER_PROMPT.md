# Codex Master Prompt

Paste this into Codex from the repository root after copying this production pack into the public game repository.

---

You are the lead engineer, technical game designer, and release owner for **SECOND HANDS: A Clockwork Heist**, a mobile-first Three.js game for the 404 Game Jam.

## Before changing anything

1. Read `AGENTS.md` completely.
2. Read every file listed under its Required Reading section.
3. Read the current organizer files from the adjacent `../404-game-recipe/` repository:
   - `GAME.md`
   - `404.md`
   - `docs/gates.md`
   - `docs/traps.md`
   - `docs/claims.md`
   - the current asset contract and verifier instructions
4. Run the organizer self-test exactly as documented.
5. Inspect available MCP connections and tools. Identify the real 404 MCP tool names and schemas. Do not guess tool names, endpoints, or successful calls.
6. Record environment, MCP availability, organizer commit, Node version, browser version, and test results in `production/TOOLING_LOG.md`.
7. Summarize any conflict between organizer documentation and this pack. Organizer rules win.

## Mission

Ship a polished game in which a porcelain thief records 20-second attempts. Rewinding restores a living clockwork vault but converts the completed attempt into an embodied replay agent called a **Second Hand**. The player coordinates up to three Second Hands to hold pressure plates, turn cranks, operate latches, and create a path to the Chronoglass jewel.

This is not primarily a game about going backward in time. It is a game about **programming cooperative agents by demonstrating their behavior with the player character**.

## Rubric priorities

Optimize in this order:

1. **Good to play (40%)**: immediate controls, readable causality, satisfying feedback, no waiting, deterministic puzzles, replay value.
2. **Looks like a made thing (30%)**: coherent 404-generated asset family, close readable camera, deliberate materials, lighting, composition, motion, and interface.
3. **What nobody else tried (20%)**: past player demonstrations become persistent cooperative agents that share the room with the current player.
4. **Receipts (10%)**: genuine public commits, three asset candidates, verifier sheets, selections, rejected ideas, critic rounds, mobile tests, and gate logs.

Do not chase feature count. A short, reliable, unforgettable game is the target.

## Hard compliance

- Every shipped 3D object must be a JavaScript Three.js code module produced through the 404 recipe.
- No GLB, GLTF, FBX, OBJ, Blender output, downloaded mesh, asset-store model, Mixamo content, hidden binary geometry, base64 mesh data, or giant literal vertex arrays.
- Primitive geometry may exist only in the clearly labeled floor prototype and must be replaced before release.
- Textures, skies, sprites, music, and sounds may be file assets only when declared with source/tool/license.
- Keep all runtime dependencies and assets inside `game/`.
- Do not copy organizer reference game code or presentation.
- Never fabricate a tool result, physical phone result, gate result, performance number, receipt, comparison, or commit history.

## Required build order

### Phase 1 — Environment and floor

- Establish repository structure and local Three.js copy.
- Create a one-tap title flow.
- Add real touch joystick, ACT, and REWIND controls.
- Build one ugly chamber using temporary primitives.
- Implement fixed-step movement and analytic collision.
- Expose truthful `window.__READY__`, `window.__START__`, and `window.__GAME__` telemetry.
- Make it run on a physical phone before moving on.

### Phase 2 — Defining mechanic

- Record player transforms at 30 Hz from a 60 Hz fixed simulation.
- Record discrete interaction start/end events with stable target IDs.
- Rewind from an immutable chamber baseline.
- Commit the completed track as an echo.
- Replay up to three kinematic, non-colliding echoes.
- Let echoes exert presence and hold mechanisms but never take the jewel or exit.
- When an echo track ends, it holds its final pose and active held target.
- Prove the complete loop: player records route to plate → rewinds → echo holds plate → current player crosses door → current player takes jewel.

### Phase 3 — Test the mechanic

Create a game-specific Puppeteer gate using real input. It must:

- use the actual served/deployed build,
- tap the real Start button,
- use real touch or pointer events,
- create an echo,
- assert `echoCount >= 1`,
- assert the echo activates the plate,
- assert the door opens,
- move the current player through the door,
- take the jewel,
- assert no console errors, unhandled errors, failed requests, or missing files,
- capture a moving filmstrip,
- output a machine-readable and human-readable verdict.

Do not continue to production art while this gate fails.

### Phase 4 — 404 production assets

For every P0 object:

1. Use the shared style lock without altering its sentence, palette, or scale.
2. Prepare one clean three-quarter reference.
3. Generate three genuinely independent JavaScript geometry candidates through the connected 404 MCP when available.
4. Verify all candidates from multiple angles with the organizer renderer.
5. Select by visual inspection and gameplay readability.
6. Preserve source, verification sheets, selection notes, rejection reasons, prompt, tool/model, and commit.
7. Add correct pivots and named parts.
8. Put only the selected module in the active asset manifest.

Start with P0 assets only: thief, pressure plate, gate/vault door, crank, clock floor, sweeping second hand, jewel pedestal, arch/wall kit, locking lever, exit hatch. Add pendulum and decorative gear cluster only when P0 is stable.

### Phase 5 — Three chamber configurations

Build three compact puzzles from the same asset family:

- Chamber 1: one echo holds a plate while the player crosses and takes the calibration jewel.
- Chamber 2: one echo holds a plate, another holds a crank, current player crosses a timed sweep.
- Chamber 3: three recorded roles operate a plate, crank, and latch while the current player crosses the pendulum path, steals the Chronoglass, and reaches the exit.

Use no loading screen between chambers. Reconfigure or rotate the same vault space where practical.

### Phase 6 — Presentation

- Implement the UI exactly from `docs/10_UI_UX_SPEC.md` and the reference prototype.
- Add a signature 0.75–1.0 second rewind sequence with reverse mechanical motion, time ribbons, audio swell, and color drain.
- Add restrained procedural audio or declared local audio.
- Add one clear feedback response for every important state change.
- Keep tutorial copy under eight words per prompt.
- Keep the player visually large in portrait mode.

### Phase 7 — Critic, performance, release

- Preserve the floor build.
- Capture target and actual moving filmstrips.
- Run no more than three fresh visual critic rounds.
- In each round, identify and fix the single highest-leverage visual problem.
- Run physical phone tests and record truthfully.
- Meet internal targets: ready under 5 seconds, transfer under 6 MB, draw calls under 250, triangles under 300,000, zero runtime errors and zero missing requests.
- Run ship/stamp tooling, live check, official jam gate, and custom gate against the exact live URL and final commit.
- Prepare the official entry JSON and PR body, but never paste a verdict not produced by the real tool.

## Scope guardrails

Do not add combat, multiplayer, backend services, dialogue trees, free camera, jumping, inventory, procedural generation, character customization, realistic physics, runtime AI/LLM calls, or more than three chambers.

When behind, cut optional bird guide, shards, separate music, decoration, and chamber variants. Never cut touch reliability, the replay-agent mechanic, 404 verification, mobile gate, or release testing.

## Work style

- Make small, focused commits using the prefixes in `AGENTS.md`.
- Update production logs as work occurs, not retrospectively.
- Run tests after each meaningful change.
- Do not edit the style lock casually.
- Ask no broad design questions already answered in the docs. Choose the documented default and move forward.
- Stop and report only when a required external credential, missing organizer connection, or unresolvable rule conflict blocks progress.

## First assignment

Execute only `prompts/01_ENVIRONMENT_AND_FLOOR.md` now. At the end, report:

- changed files,
- exact commands and test results,
- current mobile behavior,
- current telemetry state,
- current largest risk,
- next prompt to run.

> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Build Schedule — West Africa Time

This schedule begins on Tuesday, September 22, 2026 at approximately 22:00 WAT. The official deadline is September 26 at 00:59 WAT. The internal submission deadline is **Friday, September 25 at 19:00 WAT**.

The schedule assumes one focused builder directing Codex. Use Git commits as checkpoints. Never let an agent work for hours without a testable result.

## Tuesday, September 22 — Prove the mechanic

### 22:00–22:30 — Repository and rules

- Create the public repository.
- Add this production pack.
- Commit: `docs: establish second hands production brief`.
- Clone official recipe next to the project.
- Run `npm install` and organizer self-test.
- Confirm Node version and local server.
- Confirm Codex can read `AGENTS.md`.
- Inspect available MCP tools and record the real 404 connection state.

### 22:30–00:00 — Floor scene and input

- Copy starter scaffold.
- Pin Three.js and copy it locally.
- Render temporary circular floor, player, plate, door, objective.
- Implement fixed camera and renderer resize.
- Implement keyboard movement.
- Implement real touch joystick, ACT, and REWIND controls.
- Test on a 390 × 844 viewport.
- Commit: `prototype: add mobile floor scene and input`.

### 00:00–02:00 — Record and replay

- Implement transform recorder.
- Implement manual rewind state.
- Implement one echo replay and final-pose hold.
- Implement plate activation from player/echo positions.
- Implement door opening.
- Complete the one-room sequence.
- Run logic tests.
- Commit: `feat: complete first echo plate puzzle`.

### Stop condition for the night

A player can:

1. tap Start,
2. move to plate,
3. rewind,
4. see an echo repeat and hold,
5. cross the open door,
6. collect the objective.

Do not work on art before this is true.

## Wednesday, September 23 — Finish gameplay P0

### 08:00–10:00 — Stabilize replay

- Fixed-step update.
- 30 Hz recording.
- Discrete interaction events.
- Three-echo cap.
- clear-last and full restart.
- deterministic reset registry.
- varying render-cadence tests.
- Commit: `feat: make echo replay deterministic`.

### 10:00–12:00 — Custom gate

- Build real-touch custom gate for Chamber 1.
- Assert echo count, plate activation, door open, objective pickup.
- Capture filmstrip.
- Fail on console errors and missing files.
- Commit: `test: gate the defining echo mechanic`.

### 12:00 decision gate

If Chamber 1 and the custom gate do not pass, stop adding chambers. Fix them. If still broken by 15:00, invoke fallback scope: one room with three configurations.

### 12:00–15:00 — Chamber 2

- Add crank/hold interaction.
- Add deterministic sweeping second hand.
- Add second echo layering.
- Add completion and result state.
- Manual mobile test.
- Commit: `feat: add split dial chamber`.

### 15:00–18:00 — Chamber 3

- Add locking lever.
- Add pendulum path.
- Add jewel and escape mode.
- Validate three-echo composition.
- Commit: `feat: complete heart vault chamber`.

### 18:00–20:00 — Progression and save

- Chamber transitions.
- Bronze completion.
- localStorage progress/settings.
- instant restart.
- Commit: `feat: add progression and reliable restart`.

### 20:00–23:00 — P0 playtest

- Play full game on laptop.
- Play full game on physical Android.
- Fix control or logic blockers only.
- Record all failures honestly.
- Commit: `fix: resolve first full-play blockers`.

### End-of-day P0 rule

Gameplay feature freeze after Wednesday night. New mechanics after this point require removing another feature and documenting why.

## Thursday, September 24 — Produce the visual game

### 08:00–09:00 — References and target frames

- Lock exact style file.
- Create target full-scene frames.
- Create clean references for P0 assets.
- Record provenance.
- Preserve six floor-build frames.

### 09:00–13:00 — P0 404 asset batch

Generate three candidates each for:

- thief,
- pressure plate,
- vault door,
- crank,
- clock floor,
- second hand,
- jewel pedestal,
- arch/wall module.

Use parallel agents with separate scratch directories. Do not integrate unverified outputs.

### 13:00–15:00 — Verify and select

- Run syntax and organizer verifier.
- Inspect all views.
- Select by eye.
- Complete receipts.
- Fix pivots/names/scale.
- Commit in focused asset groups.

### 15:00–18:00 — Integrate and animate

- Replace all floor primitives.
- Connect named moving parts.
- Confirm collision remains simple.
- Confirm every asset appears in actual game frames.
- Run custom gate after each major integration batch.

### 18:00–20:00 — Lighting and camera

- Implement warm/cool lighting lock.
- Fix floor readability.
- Tune hero scale.
- Check phone filmstrip.
- Measure rig performance.

### 20:00–22:00 — UI, sound, VFX

- Integrate polished UI.
- Add procedural SFX.
- Add rewind wash and route ribbon.
- Add echo slot/identity feedback.
- Add jewel payoff.

### 22:00–23:30 — Visual critic round 1

- Capture moving frames.
- Blind compare with target frames and floor.
- Ask critic for the single most decisive weakness.
- Fix only that weakness.
- Record before/after and commit.

## Friday, September 25 — Stabilize and submit

### 08:00–10:00 — Complete visual pass

- P1 assets only if P0 is stable.
- Remove every placeholder.
- Fix scale/material inconsistencies.
- Ensure no critical object is hidden by UI.

### 10:00–12:00 — Mobile performance

- Profile three echoes and full VFX.
- Cap DPR.
- Reduce draw calls/transparency.
- Test ten rewinds and ten restarts for leaks.
- Commit: `perf: lock mobile release budget`.

### 12:00–13:30 — Critic round 2

- Fresh critic.
- Moving frames only.
- Choose one decisive fix.
- If the same structural complaint returns twice, change the plan or accept it. Do not run endless rounds.

### 13:30–15:00 — Full QA

- Unit tests.
- custom gate.
- all chambers phone/laptop.
- audio lifecycle.
- pause/restart/save.
- no errors/404s.
- complete receipts and logs.

### 15:00–16:00 — Ship/stamp and deploy

- Run organizer ship tool.
- Resolve every warning.
- Stamp imports if required.
- Deploy exact release commit.
- Wait only for deployment completion; do not make unrelated changes.

### 16:00–17:00 — Test the live URL

- organizer live phone check,
- organizer live desktop check,
- custom gate against live URL,
- physical phone test on live URL.

### 17:00–18:00 — Official jam gate

- Run official gate with exact release SHA.
- Save unedited verdict.
- If it fails, fix only the named release blocker and rerun.

### 18:00–19:00 — Submission

- Fill official entry JSON.
- Confirm title, slug, URLs, SHA, agent/models, art declarations, `what_i_found`, wallet/contact.
- Fork jam repo and open pull request.
- Paste unedited verdict.
- Verify PR timestamp before internal deadline.

### 19:00 onward — Emergency buffer only

Allowed:

- broken hosting path,
- cache mismatch,
- JSON typo,
- gate mismatch,
- organizer-requested deployment correction.

Not allowed:

- new chamber,
- new mechanic,
- art redesign,
- extra game mode.

## If the schedule slips

### By Sep 23 12:00

If echo puzzle does not work: cut to one chamber immediately.

### By Sep 24 13:00

If asset generation is behind: finish six P0 assets and reuse them. Cut bird, extra wall variants, pendulum art; use a verified simplified mechanism.

### By Sep 24 22:00

If UI/VFX are behind: use included UI prototype, procedural sound only, and one clean rewind effect.

### By Sep 25 12:00

No more creation. Stabilize, profile, deploy, and submit.

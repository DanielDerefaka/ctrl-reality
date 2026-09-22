# Session 05 — Three Chamber Configurations and Replay Value

## Objective

Expand the proven mechanic into three concise chambers without adding new control complexity or a large new asset set.

## Read first

- `docs/06_LEVEL_AND_PUZZLE_DESIGN.md`
- `docs/05_CORE_LOOP_AND_MECHANICS.md`
- `docs/03_GAME_DESIGN_DOCUMENT.md`

## Chamber rules

- Same fixed camera family and core vault kit.
- Same three controls.
- Each chamber introduces exactly one new coordination problem.
- Puzzle cause/effect must be visible through moving mechanisms.
- Restart must be immediate.
- No chamber may require guessing an off-screen state.
- No mandatory collectible hunting.
- First-play total target: 8–12 minutes.
- Judge replay value target: medals and route improvement within a 30-minute session.

## Implement

### Chamber 1 — The First Lock

- One pressure plate.
- One gate.
- One echo needed.
- Teaches final-pose hold.
- Target solution readable without text after one failed attempt.

### Chamber 2 — The Split Dial

- Plate A opens access to a crank.
- Crank holds a bridge/ring alignment while operated.
- Sweeping second hand creates a timing window.
- Two echoes needed.
- Current player uses the completed route to cross and claim chamber seal.

### Chamber 3 — The Heart Vault

- Plate, crank, and timed locking lever.
- Pendulum or second-hand path provides visible timing pressure.
- Three echoes needed.
- Current player steals the Chronoglass and reaches the exit.
- Final composition must place all three echoes visibly in frame during the climax.

## Scoring

Track:

- chamber completion time,
- rewinds used,
- hazard hits,
- optional chrono shard,
- total heist time.

Medals:

- Bronze: complete.
- Silver: meet the chamber rewind budget and avoid excessive hits.
- Gold: meet time + rewind + hit targets.

Tune targets after at least five fresh-player runs. Do not choose arbitrary impossible times.

## Accessibility and failure recovery

- Hazard contact resets the current player to the chamber spawn or last safe pad, not the whole browser session.
- Echoes are immune to hazards for deterministic replay.
- Show why a mechanism changed using lines, light, motion, and sound.
- Add a “Clear Second Hands” action in pause/restart UI.
- Do not allow a dead recording to permanently trap the player.

## Acceptance checks

- [ ] Each chamber has one intended solution and at least one harmless alternate timing.
- [ ] Chamber 1 uses one echo, Chamber 2 two, Chamber 3 three.
- [ ] All mechanisms are visible or signposted from relevant positions.
- [ ] Total first-play target is plausible from playtest data.
- [ ] Chamber restart is under one second.
- [ ] Persistent state never leaks between chambers.
- [ ] Custom gate for Chamber 1 still passes.
- [ ] A second scripted or manual route validates Chambers 2 and 3.

## Commit

```text
feat: complete three-stage clockwork heist
```

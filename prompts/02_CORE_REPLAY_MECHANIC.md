# Session 02 — Deterministic Recording, Rewind, and Echo Playback

## Objective

Implement and prove the defining mechanic with temporary geometry: a past performance becomes a useful embodied agent.

## Read first

- `docs/05_CORE_LOOP_AND_MECHANICS.md`
- `docs/11_TECHNICAL_ARCHITECTURE.md`
- `docs/12_REWIND_ECHO_TECH_SPEC.md`
- `docs/06_LEVEL_AND_PUZZLE_DESIGN.md`, Chamber 1 only

## Required logic

- Fixed simulation: 60 Hz.
- Transform capture: every second fixed step, 30 Hz.
- Max loop: 20.0 seconds.
- Max persistent echoes: 3.
- Track contains timestamped `(x, z, yaw)` samples and discrete interaction events.
- Echo transforms interpolate between adjacent samples by loop time.
- Echoes are kinematic, non-colliding, and cannot be displaced.
- Echoes can exert `presence` and `holdInteraction` capabilities.
- Echoes cannot take objective items or exit.
- A completed echo holds its final pose and active held interaction.
- Rewind restores the exact chamber baseline, retains completed tracks, resets loop time, and respawns the current player.
- New tracks are committed only when they contain meaningful movement or interaction.
- If all three slots are occupied, explain and implement one documented policy. Preferred: replace the newest uncommitted plan only after explicit confirmation; for jam scope, a simple “erase oldest” button is acceptable only if visually clear. Do not silently destroy a useful track.

## Implement Chamber 1

1. Player starts outside a gate.
2. Pressure plate opens the gate while occupied.
3. Player walks to the plate and presses REWIND.
4. Echo 1 repeats the route and remains on the plate.
5. Current player walks through the open gate.
6. Current player uses ACT at the jewel pedestal.
7. Chamber completes and shows a compact result overlay.

## Rewind presentation floor

For this session, presentation may be simple but the state transition must be real:

- input locks,
- color desaturates,
- mechanical objects interpolate to baseline in reverse,
- old player path briefly appears,
- current player returns to spawn,
- echo slot becomes visible,
- next loop begins without a page reload.

Keep the transition under 1.0 second.

## Unit tests

Add pure tests for:

- sample capture cadence,
- interpolation before, between, and after samples,
- discrete event ordering,
- final pose hold,
- final held interaction persistence,
- baseline reset,
- maximum track policy,
- deterministic plate/door logic,
- only current player can take jewel.

## Manual test matrix

Test all of these:

- keyboard-only solution,
- touch-only solution,
- rewind before movement,
- rewind while holding ACT,
- loop timer expiry,
- visibility loss during a run,
- releasing joystick during rewind,
- restarting chamber after a completed run,
- repeat solution twice without stale state.

## Acceptance checks

- [ ] Echo follows the demonstrated route closely at varying render frame rates.
- [ ] Echo holds the plate after track end.
- [ ] Door opens because of echo presence, not a fake scripted timer.
- [ ] Current player can take the jewel; echo cannot.
- [ ] Rewind produces no duplicated events or ghost input.
- [ ] Chamber can be solved twice without reload.
- [ ] Telemetry accurately reports track count, plate state, door state, and jewel state.
- [ ] All tests pass and console stays clean.

## Commit

```text
feat: prove embodied replay agent puzzle loop
```

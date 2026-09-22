# Rewind and Echo Technical Specification

## Why this system is the project

The echo mechanic is not one feature among many. It is the originality claim and the main source of playability. Build it before production art. Test it as pure logic where possible.

## Requirements

- Same recorded route plays consistently across devices and frame rates.
- A track can end early and hold its final pose.
- Discrete interactions fire exactly once at the intended loop time.
- Rewind restores the chamber baseline without deleting persistent tracks.
- Three tracks can run simultaneously without large allocations or frame spikes.
- Visual rewind does not need to literally simulate all physics backward; state correctness matters more than physical simulation.

## Time bases

Use three distinct time concepts:

1. **Real time** — `performance.now()`, used for FPS and UI animation.
2. **Simulation time** — fixed 60 Hz steps, used for gameplay.
3. **Loop time** — simulation seconds since the current loop began, used for recording and replay.

Never use render frame count as the timeline.

## Track format

```js
{
  id: 'echo-1',
  colorKey: 'cyan',
  shapeKey: 'circle',
  duration: 6.733,
  samples: [
    { t: 0.000, x: 0, z: 5, yaw: 3.14, pose: 0 },
    { t: 0.033, x: -0.04, z: 4.93, yaw: 2.95, pose: 1 },
  ],
  events: [
    { t: 6.100, type: 'interaction-start', targetId: 'plate-a' }
  ],
  metadata: {
    distance: 3.62,
    chamberId: 1,
    createdAtLoop: 0
  }
}
```

For a presence plate, explicit interaction events are not required; actor position activates it. Keep metadata for receipts/debugging, not gameplay dependence.

## Sampling

Record every second fixed step for 30 Hz:

```js
if ((simulationTick & 1) === 0) {
  recorder.capture(loopTime, playerState);
}
```

At 20 seconds:

- 600 samples per track,
- 3 tracks = 1,800 samples,
- memory is trivial in JavaScript when fields remain compact.

Avoid storing Three.js vectors or object references. Store numbers and stable string IDs.

## Interpolation

Given time `t`:

1. If no samples, return spawn.
2. If `t <= first.t`, return first.
3. If `t >= last.t`, return last and mark `finished=true`.
4. Otherwise find neighboring samples.
5. Linear-interpolate x/z.
6. Shortest-path interpolate yaw.
7. Choose pose by nearest or explicit state transition.

Use a moving sample cursor because loop time moves forward. Do not binary-search every echo every frame unless simplicity is more valuable; both fit this scale.

## Event playback

Each echo owns `eventCursor`.

```js
while (events[eventCursor] && events[eventCursor].t <= loopTime + EPSILON) {
  dispatchEchoEvent(actor, events[eventCursor]);
  eventCursor += 1;
}
```

On loop restart, set `eventCursor = 0` and clear all active held interactions before replay begins.

For held interactions, an `interaction-start` must be paired with `interaction-end`. If the recording ends while held, synthesize an end at `track.duration + 0.001` only when the design does not want final hold. For this game, an echo may continue holding the last active mechanism after track end, so track the final held target explicitly.

## Final-pose hold

When playback reaches the end:

- keep last x/z/yaw,
- keep the last pose or switch to a subtle hold pose,
- preserve allowed held interaction,
- stop route particles,
- retain low-intensity echo core pulse.

This rule makes short demonstrations powerful and easy to understand.

## Commit logic

```js
function commitCurrentTrack() {
  const track = recorder.finalize();
  if (!isMeaningful(track)) return { created: false };

  if (echoes.length >= MAX_ECHOES) {
    return { created: false, reason: 'no-slot' };
  }

  echoes.push(createEchoTrack(track, echoes.length));
  return { created: true, track };
}
```

Meaningful criteria:

- duration >= 1.0 s, or
- distance >= 0.8 m, or
- at least one interaction event.

## Rewind correctness sequence

Do not mix logical reset and visual effect without a plan.

### Phase 1: freeze and commit

- Stop accepting player input.
- Finalize track.
- Capture route for visual ribbon.
- Determine whether a new echo will be created.

### Phase 2: visual reverse

- Play a 0.75–0.9 second authored animation.
- It may interpolate mechanism views toward baseline while logical state is frozen.
- Do not dispatch gameplay interactions during this phase.

### Phase 3: logical reset

- End all active interactions.
- Restore baseline state.
- Reset hazard phase and loop time.
- Reset actor/event cursors.
- Reset player to spawn.
- Create echo view if valid.

### Phase 4: resume

- Start all echo tracks at loop time zero.
- Start recorder for the current player.
- Unlock input.

## Clearing tracks

Provide one simple recovery action:

- Pause → `CLEAR LAST HAND`, or
- hold REWIND for 1.2 seconds while at the start position and loop time < 1.0 s.

Clearing last hand removes the newest track only and restarts the loop. Full restart clears all tracks.

## Hazard interaction with tracks

- Hazards never alter echo tracks.
- Echoes can be visually passed through by hazards because they represent recorded history.
- Current player hit returns to loop start or last safe position depending on chamber.
- A hit increments score penalty but does not force a new echo.
- Hazard timing is deterministic from loop time.

## Chamber progression

Tracks do not carry between chambers. This keeps complexity bounded and lets each chamber teach a clean composition.

## Desynchronization debugging

Add a debug overlay behind `?debug=1`:

- loop time,
- sample cursor for each echo,
- current/last sample index,
- active held target,
- position error between recorded and rendered echo,
- reset count,
- hazard phase.

Add a deterministic replay test that simulates the same track at 30, 60, and 120 render FPS while the simulation remains 60 Hz. Final transforms and event counts must match within tolerance.

## Pure logic tests

Required tests:

- interpolation at exact sample,
- interpolation between samples,
- shortest yaw interpolation,
- hold final pose,
- event dispatch once,
- event cursor reset,
- maximum echo cap,
- meaningless track rejection,
- baseline reset preserves tracks,
- held interaction state at track end,
- deterministic result under varied render cadence.

## Visual identity of tracks

Do not make echoes visually noisy.

- Shared thief geometry.
- Distinct core color.
- 55–75% opacity depending on background.
- Thin route filament only for 0.8 seconds after rewind, then fade.
- Ground contact ring uses the echo’s shape.
- Slight delayed afterimage at low alpha, maximum two segments.
- Current player remains warm ivory; echoes remain cool/colored.

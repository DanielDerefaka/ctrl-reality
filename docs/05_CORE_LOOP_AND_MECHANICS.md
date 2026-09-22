# Core Loop and Mechanics Specification

## 1. Runtime state machine

```text
BOOT
  → TITLE
  → CHAMBER_INTRO
  → PLAYING
      ↘ REWINDING → PLAYING
      ↘ HIT_RECOVERY → PLAYING
      ↘ PAUSED → PLAYING / RESTART
      ↘ CHAMBER_COMPLETE
  → RESULT
  → NEXT_CHAMBER / REPLAY
  → FINAL_RESULT
```

Only `PLAYING` advances the chamber simulation. UI animation may continue elsewhere, but gameplay timers do not.

## 2. Simulation timing

- Fixed simulation step: `1 / 60` second.
- Maximum catch-up steps per render: 5.
- Clamp accumulated real time to prevent a hidden tab from simulating minutes in one frame.
- Render interpolation is optional but recommended.
- Compute FPS from real elapsed time, not the clamped simulation delta.

## 3. Movement

### Desired feel

Direct, elegant, and readable rather than physics-heavy.

- Maximum speed: approximately 4.2 m/s.
- Acceleration to maximum: 0.10–0.14 seconds.
- Deceleration: 0.08–0.12 seconds.
- Rotation faces the movement direction with 100–160 ms damping.
- Character collision uses a circle/capsule against simple static blockers.
- No dynamic rigid-body simulation.

### Input normalization

Combine keyboard and touch into one `Vector2` in the range `[-1, 1]`. Clamp diagonal magnitude to one. Touch joystick dead zone: 0.12. Full input at radius 0.72 of the visual pad.

## 4. Interactions

### ACT behavior

- Tap ACT near an instant object: trigger once.
- Hold ACT near a hold object: maintain activation while held and in range.
- Show a small contextual ring only when a valid target is near.
- Target selection uses distance first, then view/screen relevance.
- Stable target IDs are required for recording and replay.

### Interaction types

| Type | Current player | Echo | Example |
|---|---:|---:|---|
| Presence | yes | yes | pressure plate |
| Hold | yes | yes | crank |
| Timed tap | yes | yes | locking lever |
| Objective pickup | yes | no | Chronoglass jewel |
| Exit | yes | no | final hatch |

Echoes must never complete the objective or exit on behalf of the player.

## 5. Recording

### Transform samples

Record at 30 Hz from the fixed-step simulation:

```js
{
  t: 4.266,
  x: -2.31,
  z: 1.74,
  yaw: 1.57,
  pose: "run"
}
```

### Discrete events

```js
{
  t: 7.433,
  type: "interaction-start",
  targetId: "crank_inner"
}
```

```js
{
  t: 10.200,
  type: "interaction-end",
  targetId: "crank_inner"
}
```

Record gameplay intent, not visual effects. VFX and sound should be regenerated from replayed state.

## 6. Echo playback

- Sample the track by loop time.
- Interpolate x, z, and yaw between frames.
- Trigger events once when crossing their timestamps.
- Hold the final transform after the last frame.
- Reset event cursor to zero at loop restart.
- Use the same interaction system with an actor capability flag.
- Do not run collision resolution on echo transforms.
- Do not allow echoes to push props or the player.

## 7. Rewind sequence

### Trigger conditions

- Timer reaches zero.
- Player taps REWIND.
- Scripted tutorial prompt requests rewind.

### Validation

A track is meaningful when one of these is true:

- the player moved at least 0.8 m,
- an interaction event occurred,
- at least 1.0 second of the loop elapsed.

If not meaningful, restart the current loop without consuming an echo slot.

### Sequence timing

| Time | Action |
|---:|---|
| 0.00 | lock player input, snapshot final track |
| 0.00–0.15 | desaturate, lower music, emphasize tick |
| 0.10–0.80 | animate clock hand and mechanism states backward |
| 0.15–0.75 | draw reverse route ribbon toward spawn |
| 0.70 | restore chamber baseline |
| 0.78 | create or update echo actor |
| 0.85 | restore color and reset loop clock |
| 0.90 | unlock input and start all tracks |

Total target: 0.9 seconds. Never exceed 1.2 seconds.

## 8. Chamber baseline

Each chamber creates an immutable baseline after all production assets are loaded and positioned. The baseline stores:

- transform and logical state of mechanisms,
- door openness,
- crank progress,
- hazard phase,
- collectible availability,
- objective state,
- lighting accent state,
- particle pools reset state.

A rewind should not reconstruct the entire scene graph. Reset known stateful components through a registered reset interface.

```js
resetRegistry.add({
  id: "door_outer",
  captureBaseline,
  resetToBaseline,
});
```

## 9. Plate logic

A pressure plate is active when any allowed actor is within its horizontal trigger radius and vertically valid.

- Use hysteresis to avoid flicker at the edge.
- Activate at radius 0.85 m.
- Deactivate after radius 0.98 m.
- Smooth visible compression over 120 ms.
- Logical state may change immediately; visible state catches up.

## 10. Door logic

- A closed door blocks the current player.
- Echoes remain kinematic and may visually cross according to their track.
- Door opening is driven by logical inputs, then visually animated.
- Open/close movement: 250–400 ms.
- Add a brief pin retraction lead-in so the state reads mechanically.
- Never close on the current player. Use a safety sensor and hold open until clear.

## 11. Crank logic

- Requires ACT hold while in range.
- Accumulates progress while held.
- Slowly decays if abandoned unless the chamber design says it latches.
- Echo replay emits interaction start/end at recorded timestamps.
- The attached bridge or ring should visibly follow crank progress.

## 12. Hazards

Use only deterministic hazards:

- sweeping clock hand,
- pendulum crossing,
- retracting pins.

Their phase is a pure function of loop time and chamber seed. This guarantees that a demonstrated route remains repeatable.

## 13. Scoring

Track:

- real elapsed chamber time,
- loops used,
- rewinds,
- hazard hits,
- optional shard collected,
- completion.

Do not award points for waiting or unnecessary loops. The medal calculation happens once at completion.

## 14. Save data

Use local storage with a versioned structure:

```json
{
  "version": 1,
  "unlockedChamber": 2,
  "best": {
    "chamber1": {"medal": 3, "timeMs": 42120, "loops": 2},
    "chamber2": {"medal": 1, "timeMs": 113450, "loops": 3}
  },
  "settings": {
    "music": 0.7,
    "sfx": 0.9,
    "reducedMotion": false
  }
}
```

Corrupt or old data should fail safely to defaults.

## 15. Tutorial copy

Use prompts only when the player reaches the related state:

1. `MOVE TO THE PLATE`
2. `REWIND TO LEAVE A HAND`
3. `FOLLOW YOUR SECOND HAND`
4. `HOLD ACT TO TURN`

Each disappears after the corresponding action. Do not show all prompts at once.

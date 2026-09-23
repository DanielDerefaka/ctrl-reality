> Historical production-pack reference. The user-approved Zero Hour design in docs/03_GAME_DESIGN_DOCUMENT.md supersedes conflicting clockwork scope, controls, camera, timing and palette. Original wording is retained for provenance.

# Level and Puzzle Design

## Overall structure

The game is presented as one pocket-watch vault with three chambers. Technically, each chamber may be a separate scene configuration, but the player experiences a continuous inward descent through concentric rings.

The goal is not to create hard abstract puzzles. The goal is to create satisfying temporal choreography that is readable to a first-time judge on a phone.

## Shared spatial grammar

- The player begins at the bottom of the portrait frame.
- The objective sits toward the upper half.
- Plates use circular floor inlays.
- Gates use radial brass leaves or sliding locking pins.
- Hold interactions have visible handles.
- The giant second hand moves clockwise in normal play and backward during rewind.
- Echo routes use thin ground ribbons only while recording/rewinding; persistent echoes use a restrained trailing filament.
- The current path and objective must remain visible from the fixed camera.

## Chamber 1 — The First Lock

### Purpose

Teach the full game in one clean realization: the previous self can remain on a plate.

### Layout

```text
         [CALIBRATION KEY]
                 ◇
          ┌──── GATE ────┐
          │              │
  [PLATE] ○              │
          │              │
          └─────┬────────┘
              [SPAWN]
```

Suggested world positions:

```text
spawn:       ( 0.0,  5.0)
plate:       (-3.0,  2.8)
gate center: ( 0.0,  0.7)
key:         ( 0.0, -3.8)
```

### Intended solve

1. Player moves left/up to the plate.
2. Plate compresses, door opens, but the player cannot leave the plate and cross before it closes.
3. Context prompt appears: `REWIND TO LEAVE A HAND`.
4. Player taps rewind while standing on the plate.
5. The echo repeats the route and holds its final pose.
6. Current player crosses the gate.
7. Player taps ACT at the calibration key.

### Anti-frustration features

- The plate is close enough to reach in under four seconds.
- The gate remains open for 350 ms after the plate releases.
- The echo’s final hold pose is visibly anchored with a small ring.
- If the player repeatedly leaves the plate instead of rewinding, the prompt points to the rewind control with one pulse.
- The gate safety sensor prevents closing on the player.

### Completion target

- Bronze: retrieve key.
- Silver: use exactly one echo and take no hit.
- Gold: finish in under 45 seconds.

## Chamber 2 — The Split Dial

### Purpose

Teach that a second demonstration can be built on top of the first.

### Layout

```text
                    [INNER EXIT]
                         △
               ┌── MOVING BRIDGE ──┐
               │        ↑          │
          [CRANK]                  [SHARD]
               │                   │
          ┌──── GATE A ────────────┘
          │
    [PLATE A]
          │
       [SPAWN]

       Giant second hand sweeps across bridge.
```

### Intended solve

1. First run: record Anchor moving to Plate A and rewind.
2. Second run: Anchor opens Gate A; current player crosses, reaches the crank, holds ACT, and rewinds while holding.
3. Third run: Anchor opens Gate A; Turner reaches crank and holds the bridge in position; current player times crossing between sweeps of the giant hand.
4. Player reaches the inner exit.

### Timing values

- Gate A opens in 300 ms.
- Crank reaches full bridge alignment after 1.2 seconds held.
- Bridge remains aligned only while crank is held.
- Second hand completes one sweep cycle in 4.8 seconds.
- Contact with the hand returns the current player to loop start with a 1.0-second time penalty; echoes continue.

### Optional chrono shard

Place the shard on a small side platform that requires crossing one sweep later. It should be visible but clearly optional.

### Completion target

- Bronze: reach inner exit.
- Silver: use no more than two echoes and take no hit.
- Gold: collect shard and finish in under 95 seconds.

## Chamber 3 — The Heart Vault

### Purpose

Deliver the full coordinated heist and visual payoff.

### Layout

```text
                     [JEWEL]
                       ◆
                 ┌─ HEART DOOR ─┐
                 │              │
        [LEVER]  │              │  [EXIT HATCH]
            △    │              │       ▽
                 └──────┬───────┘
                        │
                 [PENDULUM PATH]
                        │
        [CRANK] ─── [LOCK RING] ─── [PLATE]
                        │
                     [SPAWN]
```

### Roles

1. **Anchor:** reaches and holds the pressure plate. This retracts the outer pins.
2. **Turner:** passes the retracted pins and holds the crank. This rotates the lock ring and aligns the pendulum path.
3. **Latch:** passes while Anchor and Turner work, reaches the lever, and taps ACT at a specific timing window. This unlocks the heart door for the final loop.
4. **Current thief:** uses all three recorded roles, crosses the pendulum path, steals the jewel, and reaches the exit.

### Intended recording sequence

#### Loop A — Anchor

- Move to plate.
- Rewind while centered.

#### Loop B — Turner

- Follow Anchor through opening.
- Reach crank.
- Hold ACT until bridge/ring aligns.
- Rewind while holding.

#### Loop C — Latch

- Pass outer lock with Anchor.
- Pass inner ring while Turner holds.
- Time the pendulum corridor.
- Tap lever when its three teeth align.
- Rewind immediately after latch engages.

#### Final loop

- Follow the complete choreography.
- The heart door opens.
- Hold ACT for 0.6 seconds at the jewel pedestal.
- All echoes look toward the jewel.
- Exit hatch activates.
- Return to exit before the accelerated collapse timer reaches zero.

### Jewel sequence

Keep it under 1.5 seconds:

1. Pedestal petals unfold.
2. Jewel rises 20 cm.
3. Audio drops to silence for 120 ms.
4. Harmonic bell and warm light burst.
5. Echoes turn their heads.
6. Timer switches to escape mode with stronger tick.

### Escape mode

- 12 seconds.
- Echoes continue their tracks/hold poses.
- Mechanisms remain in solved state.
- No new recording is allowed after jewel pickup.
- A failure returns the current player to the jewel pickup moment, not the entire chamber, to protect the payoff.

### Completion target

- Bronze: escape with jewel.
- Silver: use no more than three echoes and take no hit.
- Gold: collect shard and finish in under 160 seconds total.

## Puzzle quality rules

- Every chamber should have one intended insight, not several hidden exceptions.
- The player must be able to see a causal line from actor → mechanism → gate.
- Do not place two unrelated interactables within the same ACT targeting radius.
- Never require sub-200 ms timing on phone.
- Avoid moving-camera timing challenges.
- Always provide a safe observation area before a hazard.
- A failed attempt should reveal something useful.
- No chamber should require waiting more than two seconds with no decision.
- The final run should show all active roles in the same frame at least once.

## Scope fallback layouts

If implementation falls behind, ship one chamber with three configurations:

1. Config A: one plate and one gate.
2. Config B: plate plus crank.
3. Config C: plate plus crank plus timed lever.

Use the same room, move only mechanisms, change light accent, and retain medals. This preserves the mechanic and the visual set while cutting scene transitions and extra decoration.

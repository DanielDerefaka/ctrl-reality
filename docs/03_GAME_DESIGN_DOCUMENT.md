# Game Design Document

## 1. Identity

**Name:** SECOND HANDS: A Clockwork Heist  
**Tagline:** Rewind builds the crew.  
**Genre:** Compact 3D temporal coordination puzzle  
**View:** Fixed three-quarter diorama  
**Audience:** Players who enjoy immediate spatial puzzles and short mastery loops  
**Session:** 6–10 minute first clear, 20–30 minutes for medals and optimization

## 2. High concept

A porcelain thief is trapped inside an enormous pocket-watch vault. No single body can hold every plate, turn every crank, and cross every gate in time. Every attempt is recorded. Rewinding restores the vault but leaves behind a Second Hand that repeats the previous attempt exactly. The player solves the heist by programming a crew through demonstration.

## 3. Design pillars

### Pillar A — Demonstrate, do not command

The player never opens a companion menu. To create a useful agent, the player physically performs the route. The recorded behavior becomes a visible collaborator.

### Pillar B — Failure becomes infrastructure

An unsuccessful run is still productive because it can become a plate holder, crank operator, or timed distraction. The emotional movement is from “I failed” to “I just built part of the solution.”

### Pillar C — Physical rules are visible

Doors have pins. Plates compress springs. Cranks turn gear trains. The clock hand is both timer and hazard. The player should understand state by looking at the machine.

### Pillar D — One exquisite object set

The game reuses a small set of carefully verified 404 assets rather than filling a large scene with weak props.

## 4. Player verbs

- Move.
- Interact / hold ACT.
- Rewind.
- Observe previous selves.
- Time movement against mechanical hazards.
- Optimize a route.

There is no jump, aim, inventory, free camera, dialogue tree, or combat system.

## 5. Main loop

1. Enter chamber.
2. Read the visible mechanism.
3. Perform a useful route for up to 20 seconds.
4. Rewind manually or when time expires.
5. Previous attempt becomes a Second Hand.
6. Start again while all saved Second Hands replay from time zero.
7. Add another demonstration if necessary.
8. Use the coordinated state to reach the objective.
9. Receive medal and replay target.

## 6. Time-loop rules

- Loop duration: 20 seconds by default.
- Manual rewind is always available after 0.75 seconds of movement.
- The most recent run becomes an echo when it contains at least one second of meaningful activity.
- An echo holds its last recorded pose after its track ends. This makes “walk to plate, rewind” intuitive.
- Up to three echoes can persist in a chamber.
- All echoes begin replay simultaneously at loop time zero.
- Echoes repeat position, facing, and interaction events.
- Echoes activate plates and operate approved mechanisms.
- Echoes are kinematic and do not collide with the player or one another.
- The current player collides with walls, closed gates, and hazards.
- A rewind restores the chamber baseline but preserves echo tracks.
- Completing or restarting a chamber clears its tracks.

## 7. Core readability language

| State | Visual | Audio | UI |
|---|---|---|---|
| Plate inactive | raised brass face, dark inlay | faint tick | no icon |
| Plate active | compressed, cyan rim, gears turning | low clunk | tiny linked icon |
| Door locked | pins extended, red seam | tight rattle on approach | objective unchanged |
| Door open | pins retract, leaves separate | three-part mechanical release | “PATH OPEN” toast |
| Echo recording committed | room rewind and color drain | reverse clock swell | echo slot fills |
| Echo active | translucent porcelain, colored core, trail | soft metronome tone | matching shape/color slot |
| Hazard active | red reflection and moving shadow | rising tick | timer ring pulses |
| Objective acquired | jewel opens, room warms | harmonic bell | result banner |

## 8. Chamber structure

The game uses one vault kit with three configurations.

### Chamber 1: The First Lock

**Lesson:** an echo can hold a plate after its recorded path ends.  
**Required echoes:** one.  
**Layout:** spawn, plate left of spawn, central gate, calibration key behind gate.  
**Expected sequence:** move to plate → rewind → echo repeats and holds → current player crosses gate → ACT at key.  
**Target first clear:** 60–120 seconds.

### Chamber 2: The Split Dial

**Lesson:** demonstrations can be layered and timed.  
**Required echoes:** two.  
**Layout:** first plate opens outer gate; second interaction crank rotates a bridge while held; giant second hand sweeps the crossing.  
**Expected sequence:** echo one holds plate → player crosses and records crank hold → rewind → echo one opens gate, echo two holds crank, current player crosses moving bridge at safe sweep.  
**Target first clear:** 2–3 minutes.

### Chamber 3: The Heart Vault

**Lesson:** compose three recorded roles into a complete plan.  
**Required echoes:** up to three.  
**Layout:** plate, crank, final locking lever, pendulum corridor, jewel pedestal, exit.  
**Expected sequence:**

1. Record Anchor route to plate.
2. With Anchor present, record Turner route to crank and hold.
3. With Anchor and Turner present, record Latch route to lever at the correct time.
4. Final loop: cross the synchronized machine, take the jewel, return to exit before the 20-second collapse.

**Target first clear:** 3–5 minutes.

## 9. Difficulty curve

Difficulty comes from coordination, not obscure rules.

- Chamber 1 has one obvious plate and one gate.
- Chamber 2 adds distance and timing but no new controls.
- Chamber 3 combines known elements and asks for route planning.
- Restart is instant.
- Incorrect runs still produce useful visible information.
- Hazards reset the current actor to the loop start without deleting echoes, unless full restart is selected.

## 10. Medals and replay

### Bronze

Complete the chamber by any valid method.

### Silver

Complete using the intended maximum number of echoes and without taking a hazard hit.

### Gold

Complete within the par real time, use no more than the intended echoes, and collect the optional chrono shard.

Suggested par values:

| Chamber | Silver condition | Gold condition |
|---|---|---|
| First Lock | 1 echo | under 45 seconds total |
| Split Dial | 2 echoes | under 95 seconds total + shard |
| Heart Vault | 3 echoes | under 160 seconds total + shard |

Do not let medal systems delay the core submission. Bronze completion is P0. Silver/Gold are P1.

## 11. Story and tone

Story is environmental and limited to one sentence per chamber.

- Start: “The Chronoglass remembers every hand that reaches for it.”
- Chamber 1: “Teach the vault who should remain.”
- Chamber 2: “Two hands turn one impossible lock.”
- Chamber 3: “Build the crew. Steal the second.”

No voiced dialogue is required. The thief is expressive through pose, head turn, and quick mechanical anticipation.

## 12. Failure and recovery

### Timer expiry

Automatically triggers rewind and commits the current track when valid.

### Hazard hit

Freeze for 150 ms, flash the clock face, return the current player to loop start, and continue the loop with a small time penalty. Do not delete echoes.

### Bad recording

The player can select “CLEAR LAST HAND” from pause or hold REWIND for 1.2 seconds while at loop start. Do not require complicated track editing.

### Full restart

Clears all tracks and resets the chamber in under one second.

## 13. Camera

- Fixed perspective or orthographic-like perspective at approximately 38–45 degrees down.
- No player-controlled rotation.
- Keep the player at 12–18% of frame height on phone.
- Slight camera dolly inward as chambers progress.
- Camera shake limited to 2–4 px equivalent and disabled under reduced-motion preference.
- Never hide the active objective behind the vault door or giant hand.

## 14. Content boundaries

Not in scope:

- multiplayer,
- online accounts,
- procedural level generation,
- combat,
- stealth AI,
- dialogue,
- inventory,
- free camera,
- physics-based ragdolls,
- runtime LLM calls,
- more than three chambers,
- more than three persistent echoes.

## 15. Final emotional beat

When the jewel is taken, every echo pauses and turns its head toward the current player for half a second. Then the clock resumes at double speed and all four thieves sprint for the exit. This is a short, authored payoff that makes the crew feel intentional without adding dialogue or AI.

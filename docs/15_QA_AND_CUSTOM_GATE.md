# QA and Custom Gate

## Why a custom gate is mandatory

The organizer’s generic playtest walks or drives forward. It cannot prove that SECOND HANDS records an attempt, creates an echo, activates a plate through replay, opens a door, and collects the objective. A passing generic movement test would leave the defining mechanic untested.

The custom gate skeleton is included at `starter/tools/second-hands-gate.mjs`.

## Gate principles

The gate must:

1. Serve or load the actual game folder/live URL.
2. Use a phone viewport and Android user agent.
3. Press the real Start button.
4. Drive using real touch input.
5. Assert real gameplay state through public telemetry.
6. Capture six to eight frames while the mechanic is happening.
7. Record console errors and missing requests.
8. Exit non-zero with an actionable failure message.

It may read telemetry. It must not call debug hooks to move the player or create an echo.

## Required telemetry for gate steering

```js
window.__GAME__ = {
  pos: [x, z],
  fps,
  speed,
  score,
  over,
  draws,
  tris,
  started,
  chamber,
  loopTime,
  echoCount,
  rewindCount,
  plateActive,
  vaultOpen,
  jewelTaken,
  escaped,
  objectiveProgress,
  playerBox,
  targets: {
    plateA: [x, z],
    gateA: [x, z],
    objective: [x, z]
  }
};
```

`targets` may exist only in development/custom-gate builds if desired, but leaving coordinates public is not a game exploit of consequence.

## Chamber 1 gate route

### Phase 1 — Start

- Wait for `window.__READY__ === true`.
- Find and touch `#start-game` or the current actual start control.
- Assert `started === true`.

### Phase 2 — Record Anchor

- Use a real joystick drag toward the plate target.
- Continue until player is within plate tolerance.
- Assert `plateActive === true` while `echoCount === 0`.
- Touch the real rewind button.
- Wait for rewind animation and new loop.
- Assert `echoCount === 1` and `rewindCount >= 1`.

### Phase 3 — Let echo activate plate

- Keep the current player at spawn initially.
- Wait for the echo to reach its recorded final pose.
- Assert `plateActive === true` with current player outside plate radius.
- Assert `vaultOpen === true`.

### Phase 4 — Cross and collect

- Use real joystick input to move through the open gate.
- Move into objective interaction range.
- Touch the real ACT button.
- Assert `jewelTaken === true` or Chamber 1 key equivalent.
- Assert no console errors, no missing requests, and movement > required minimum.

## Touch implementation note

A virtual joystick reads movement from the delta between touch landing point and current point. A gate that touches the center and holds still supplies zero input. The gate must touch near center, drag in the intended direction, and hold while polling telemetry.

## Filmstrip frames

Capture at least:

1. first movement toward plate,
2. plate activation,
3. rewind mid-effect,
4. echo walking,
5. echo holding plate while current player moves,
6. door open crossing,
7. objective pickup,
8. result or state confirmation.

Create one contact sheet. Inspect it manually before sending to a visual critic.

## Functional test matrix

### Start and lifecycle

- [ ] Start works from real phone tap.
- [ ] Audio context starts only after gesture.
- [ ] Pause/resume works.
- [ ] Tab background/foreground does not skip loop time.
- [ ] Orientation change does not break controls.

### Movement

- [ ] Keyboard diagonal speed is normalized.
- [ ] Touch joystick captures and releases reliably.
- [ ] Pointer cancel clears movement.
- [ ] Door collision is stable.
- [ ] Player cannot leave playable floor.

### Recording/replay

- [ ] Manual rewind creates one valid echo.
- [ ] Auto rewind creates one valid echo.
- [ ] Tiny accidental tap does not consume an echo slot.
- [ ] Track final pose holds.
- [ ] Event fires once.
- [ ] Three echoes replay together.
- [ ] Clear-last removes only newest track.
- [ ] Restart clears all tracks.

### Mechanisms

- [ ] Player activates plate.
- [ ] Echo activates plate.
- [ ] Crank hold replays.
- [ ] Door safety prevents crushing player.
- [ ] Hazard phase resets deterministically.
- [ ] Echo cannot pick up jewel.

### UI

- [ ] All buttons meet touch size.
- [ ] Safe-area insets respected.
- [ ] Timer warning readable.
- [ ] Echo slots match actor color and shape.
- [ ] Tutorial prompts dismiss correctly.
- [ ] Reduced motion preserves clarity.

### Save

- [ ] Completion persists after reload.
- [ ] Corrupt save recovers.
- [ ] Audio settings persist.
- [ ] Version migration or reset works.

## Physical-phone test log

For each real device test record:

- device and browser,
- date/time,
- URL and commit,
- network type,
- ready time,
- touch start success,
- movement success,
- full chamber result,
- visual/UI issues,
- temperature/battery observations if notable,
- tester name.

Never claim a physical-phone test if only Chrome emulation was used.

## Visual QA

Run filmstrip checks at:

- 390 × 844 phone,
- 430 × 932 large phone,
- 1365 × 768 laptop,
- reduced quality tier,
- reduced motion,
- audio muted.

Check moving frames, not posed screenshots.

## Release candidate gate sequence

1. Run unit tests.
2. Parse every module.
3. Run asset verification.
4. Run custom Chamber 1 gate locally.
5. Play all chambers manually on phone.
6. Run ship/stamp tool.
7. Deploy exact commit.
8. Run live phone test.
9. Run live desktop test.
10. Run official jam gate.
11. Save unedited verdict.
12. Confirm submission JSON SHA and URL match.
13. Open pull request before internal deadline.

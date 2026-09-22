# Session 06 — Production UI, Audio, VFX, and Signature Rewind

## Objective

Turn a mechanically complete game into an authored experience without obscuring play or weakening phone performance.

## Read first

- `docs/10_UI_UX_SPEC.md`
- `docs/13_AUDIO_VFX_AND_HAPTICS.md`
- `docs/07_ART_DIRECTION_STYLE_LOCK.md`
- `ui-prototype/README.md`

## UI implementation

Match the provided HTML/CSS prototype’s information architecture, not necessarily every decorative pixel.

Implement:

- one-tap title screen,
- top-left chamber/objective label,
- top-center 20-second clock ring,
- top-right three echo slots,
- bottom-left joystick,
- bottom-right ACT and REWIND controls,
- transient interaction prompt,
- concise chamber intro,
- pause/restart sheet,
- result/medal sheet,
- reduced-motion setting,
- sound toggle,
- safe-area insets and responsive landscape fallback.

Every touch target must be at least 64 CSS px. Primary controls should be 72–88 px where possible.

## Signature rewind sequence

Target total: 0.75–1.0 seconds.

Suggested phases:

1. **Latch (0–80 ms):** input locks, impact tick, screen clock flashes.
2. **Reverse (80–560 ms):** clock hand, gears, gate, and path effects reverse toward baseline; saturation drops; camera adds minimal inward ease.
3. **Imprint (560–760 ms):** completed route condenses into colored filament and echo body appears.
4. **Release (760–950 ms):** room color returns, new loop starts, slot label fills.

Do not use full-screen white flashes, strong shake, or effects that hide the board state.

## Feedback matrix

Add distinct feedback for:

- plate depressed,
- gate unlocked/open,
- crank engaged,
- lever timing success/failure,
- echo created,
- echo reaches final pose,
- hazard contact,
- jewel pickup,
- chamber complete,
- gold condition achieved.

Use at least two channels for critical feedback: visual + sound, or visual + haptic.

## Audio

Prefer small procedural Web Audio layers for:

- UI ticks,
- plate clunk,
- gate ratchet,
- crank clicks,
- rewind sweep,
- jewel chime.

If using file audio, keep it local, compressed, loop-safe, and declared. Unlock the audio context from the Start tap.

## Performance

- Pool particles.
- Cap trail segments.
- Avoid per-frame DOM layout thrashing.
- Update UI values only when changed or at a controlled cadence.
- Disable/reduce expensive post-processing on low tier.
- Respect reduced-motion mode.

## Acceptance checks

- [ ] The game is understandable without opening a help page.
- [ ] UI does not obscure relevant routes on 390 × 844.
- [ ] Control press states are visible and immediate.
- [ ] Rewind is readable and finishes under one second.
- [ ] Audio begins only after a user gesture and never throws autoplay errors.
- [ ] Reduced motion retains all mechanical information.
- [ ] UI can be navigated/restarted without reloading.
- [ ] Custom gate selectors remain stable.

## Commit

```text
ui: deliver production heist interface and rewind feedback
```

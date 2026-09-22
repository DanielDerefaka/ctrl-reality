# Audio, VFX, and Haptics

## Goal

Make every rule feel physical without bloating the build or masking visual clarity. Core sound can be synthesized with Web Audio. A single optional ambient/music loop may be generated with Atlas and declared if time permits.

## Audio hierarchy

1. Gameplay confirmation.
2. Timer and rewind readability.
3. Mechanism weight.
4. Atmosphere.
5. Music.

Music must never bury the rewind cue or interaction feedback.

## Core procedural sound set

### UI

- Start: soft brass click plus low bell.
- Button press: dry porcelain tick.
- Invalid action: muted two-note knock.
- Echo slot fill: short harmonic ping matching echo color role.

### Movement

- Porcelain foot taps alternating at low volume.
- Surface-aware slight pitch variation.
- Echo footsteps are quieter and filtered, not four full-volume copies.

### Mechanisms

- Plate down: low metal clunk + spring tension.
- Plate up: lighter release.
- Door pins: three rapid clicks before heavy slide.
- Crank: repeating ratchet tied to rotation speed.
- Lever: sharp latch with brief resonance.
- Pendulum: low air pass at center crossing.
- Second hand: escalating tick during final five seconds.

### Rewind

Build as layers:

1. reverse tick granular sweep,
2. low pitch descent,
3. short vacuum/suction bandpass,
4. endpoint glass ping when the echo appears.

Duration should match the visual rewind: approximately 0.9 seconds.

### Jewel

- 120 ms silence dip.
- Clear glass harmonic.
- Warm low chord.
- Accelerated escape tick begins.

## Optional music

If generated:

- 50–70 BPM equivalent.
- Sparse mechanical pulse.
- Glass harmonics and low bowed tone.
- No recognizable melody from existing work.
- Seamless 45–75 second loop.
- OGG around 96–128 kbps.
- Keep under roughly 1 MB where practical.
- Record generator/model, prompt, date, and license/provenance.

If music is not excellent by September 24 evening, cut it. A strong ambient tick and mechanism soundscape is enough.

## Web Audio implementation

- Create AudioContext only after real Start tap.
- Resume context on subsequent user gesture if mobile browser suspends it.
- Use a master gain, music gain, and SFX gain.
- Reuse oscillator/gain graphs where practical.
- Limit simultaneous echo footstep voices.
- Guard every audio call against absent/closed context.
- Persist volume settings.

## VFX system

### Rewind wash

- Full-screen CSS or post layer desaturates 55–70%.
- Subtle radial distortion or vignette, not heavy blur.
- Ground route ribbon retracts toward spawn.
- Mechanism accent lights reverse from active to baseline.
- Avoid expensive full-screen passes on phone if the organizer rig already uses composer passes.

### Echo spawn

- One expanding shape ring matching circle/triangle/diamond.
- 12–20 small code particles pulled from a pool.
- Thin vertical light seam through the actor.
- Fade into stable echo material over 220 ms.

### Plate/door

- Plate rim lights clockwise as it compresses.
- Small dust/spark particles limited to 6–10.
- Door pins emit brief warm glints.

### Hazard

- Second hand casts a readable shadow.
- A thin red leading edge appears only within 0.4 seconds of contact zone.
- Pendulum creates a cool/warm light sweep rather than many particles.

### Jewel

- Pedestal petals catch warm edge light.
- Small refracted-looking shards can be sprites or simple transparent code geometry.
- No full-screen white flash.

## Performance rules

- Pool all particles.
- Maximum active particles target: 120 on phone.
- Use one shared geometry/material per particle family.
- Avoid transparent layers over the whole screen when not needed.
- Keep bloom optional and disabled on low tier.
- Use CSS overlay for global rewind color treatment if cheaper than a composer pass.

## Haptics

Use `navigator.vibrate` only when available:

| Event | Pattern |
|---|---|
| successful ACT | `12` |
| plate activation | `8` |
| rewind | `[15, 20, 28]` |
| hazard hit | `[25, 30, 25]` |
| jewel | `[20, 20, 40]` |

Do not vibrate on every footstep. Respect user feedback/reduced-motion settings.

## Audio/VFX acceptance test

- Mute and unmute works after tab switching.
- No sound starts before user gesture.
- Rewind cue remains audible at 30% phone volume.
- Echo footsteps do not become a noisy chorus.
- Timer warning can be understood with screen hidden.
- All gameplay remains understandable with audio muted.
- VFX do not obscure the player, plate, door, or objective.

# UI and UX Specification

A functioning visual prototype is included under `ui-prototype/`. Open its `index.html` or serve the folder. The starter game uses the same design tokens.

## UX principles

1. One tap starts gameplay.
2. Three controls only: movement, ACT, REWIND.
3. The center of the screen belongs to the 3D game.
4. The player can read timer, echo count, and objective in a glance.
5. UI confirms state; it does not explain the entire rule.
6. Every important color has a shape and motion backup.
7. Menus never trap the player behind tiny controls.

## Screen inventory

### 1. Title screen

Contents:

- small eyebrow: `404 GAME JAM 001`
- title: `SECOND HANDS`
- subtitle: `A CLOCKWORK HEIST`
- one-line hook: `Program the crew by playing.`
- primary button: `BEGIN THE HEIST`
- muted controls line: `Move · Act · Rewind`
- audio toggle and reduced-motion toggle as small secondary controls

Behavior:

- The first primary-button tap creates/resumes the AudioContext and starts the chamber.
- No autoplay audio.
- No multi-page settings flow.
- Transition to play in 300–450 ms.

### 2. Chamber intro

A 1.2-second non-blocking overlay:

```text
CHAMBER 01
THE FIRST LOCK
Leave one hand behind.
```

The player may move before the overlay fully fades.

### 3. Gameplay HUD

#### Top-left objective chip

```text
CHAMBER 01
HOLD THE PLATE
```

- Maximum two lines.
- Fades to 70% opacity when unchanged.
- Briefly brightens on state change.

#### Top-center clock

- Circular 20-second ring.
- Large numeric seconds only during final five seconds or accessibility setting.
- Second-hand motif turns clockwise.
- Ring shifts from brass → amber → danger red.
- During rewind, ring spins backward and desaturates.

#### Left-side echo rack

Three vertical slots:

- circle/cyan: Hand 1,
- triangle/violet: Hand 2,
- diamond/amber: Hand 3.

States:

- empty outline,
- recording pulse,
- filled/active,
- selected for clear-last action.

#### Top-right performance/medal chip

Normal players see current medal target or chrono shard status. Debug builds may show FPS/draws via a hidden query flag, never in the submission default.

#### Bottom-left joystick

- 112–132 px outer pad.
- 56–64 px thumb.
- Dynamic origin or semi-fixed origin within a safe zone.
- First touch becomes the joystick origin.
- Finger may travel outside visual circle while input remains captured.
- Center dead zone 12%.
- Hide on desktop pointer/keyboard devices.

#### Bottom-right controls

- ACT: 72–84 px circular button.
- REWIND: 88–104 px circular button with stronger hierarchy.
- At least 18 px separation.
- Respect phone safe-area insets.
- Buttons visually depress and emit a rim pulse.
- REWIND shows remaining echo capacity.

### 4. Pause sheet

- Resume.
- Restart chamber.
- Clear last hand.
- Audio sliders/toggles.
- Reduced motion.
- Exit to title.

Use a bottom sheet on phone and centered panel on desktop. Gameplay fully pauses.

### 5. Result screen

Contents:

- medal reveal,
- chamber title,
- clear time,
- hands used,
- hazard hits,
- shard status,
- `REPLAY` and `NEXT CHAMBER`.

Keep result animation under two seconds and allow immediate skip.

### 6. Final result

- `THE CHRONOGLASS IS YOURS`
- combined clear time,
- chamber medals,
- `PLAY AGAIN`,
- compact credits/provenance link.

## Design tokens

### Typography

Use a local/system font stack to avoid network dependency:

```css
font-family: "Avenir Next", "Segoe UI", "Trebuchet MS", system-ui, sans-serif;
```

- Title: uppercase, wide tracking, 700–800 weight.
- Labels: uppercase, 0.12–0.2 em tracking.
- Numbers: tabular numerals.
- Never use a thin font over the 3D scene.

### Glass panel

```css
background: linear-gradient(180deg, rgba(20,19,26,.86), rgba(7,9,14,.78));
border: 1px solid rgba(230,201,120,.24);
box-shadow: 0 12px 40px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.05);
backdrop-filter: blur(10px);
```

Provide a non-blur fallback for weaker browsers.

### Radius

- chips: 12–16 px,
- panels: 20–24 px,
- controls: circular,
- primary button: 999 px pill or 16 px rounded rectangle.

## Responsive layout

### Phone portrait, primary judged target

- Use safe-area insets.
- Keep controls below 72% screen height.
- Keep objective and timer above 18% screen height.
- Avoid text wider than 70% of screen.
- Controls may become slightly transparent when the player moves behind them, but never invisible.

### Laptop

- Touch controls hidden.
- Bottom-right shows compact key hints for first 10 seconds.
- HUD scales down by approximately 10–15% relative to viewport.
- Mouse is not required.

### Landscape phone

Supported but not optimized. Reposition controls to corners and keep clock top-center. Portrait remains the art/composition target.

## Tutorial behavior

Prompts appear near, but not over, the relevant control/object. Each prompt requires a state predicate and dismiss predicate.

Example:

```text
show when: chamber == 1 && playerEnteredPlateZone && echoCount == 0
copy: REWIND TO LEAVE A HAND
dismiss when: rewindCount > 0
```

Never show a prompt during the global rewind animation.

## Accessibility

- Echo identity uses color + shape.
- Minimum text contrast target: WCAG AA where practical over UI panels.
- Haptics are optional and never the only feedback.
- Reduced-motion mode shortens rewind camera/VFX while preserving state readability.
- Audio sliders and mute persist.
- No essential information conveyed by red/green alone.
- Touch buttons remain at least 64 px.
- Timer warning includes pulse, sound, and numeric seconds.

## UI copy list

Use these exact short strings unless testing finds a comprehension problem:

```text
BEGIN THE HEIST
MOVE TO THE PLATE
REWIND TO LEAVE A HAND
FOLLOW YOUR SECOND HAND
HOLD ACT TO TURN
PATH OPEN
HAND RECORDED
NO HAND SLOT LEFT
CLEAR LAST HAND
RESTART CHAMBER
CHRONOGLASS TAKEN
ESCAPE
REPLAY
NEXT CHAMBER
```

## Motion

- Button press: 90 ms down, 140 ms release.
- Objective change: 180 ms brighten + 220 ms settle.
- Echo slot fill: 250 ms radial draw.
- Result medal: 700–1100 ms, skippable.
- Rewind overlay: synchronized with the 0.9-second world rewind.
- Avoid infinite floating/breathing on every panel.

## Haptics

When supported:

- ACT success: `navigator.vibrate(12)`.
- Plate activation: `navigator.vibrate(8)`.
- Rewind: `[15, 20, 28]` restrained pattern.
- Jewel: `[20, 20, 40]`.

Respect reduced-motion/feedback preference and browser permissions.

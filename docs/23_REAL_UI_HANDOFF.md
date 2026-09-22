# Real UI Handoff

The editable reference lives in `ui-prototype/`. The screenshots under `ui-prototype/screenshots/` show the intended 390 × 844 presentation.

## Screen states

### Title

- One visual mark, one title, one two-line promise, one Start button.
- Start is the only primary action.
- No lore page, login, character selection, or settings wall before play.
- The blurred vault behind the title proves there is a real 3D world waiting.

### In game

Information hierarchy:

1. central 3D puzzle,
2. timer,
3. objective and echo slots,
4. context prompt,
5. thumb controls.

The HUD should answer four questions without pause:

- What is my next objective?
- How much loop time remains?
- How many Second Hands exist?
- Can I act or rewind now?

### Result

- Immediate chamber outcome.
- Medal and measured stats.
- One dominant replay action.
- Return-to-title is secondary.
- No generic social CTA or account flow.

## Runtime binding map

| UI element | Logical source | Update cadence |
|---|---|---|
| Timer number/ring | `state.loop.time / duration` | 10–20 Hz visual update |
| Echo slots | persistent track count and identity | on track add/remove |
| Objective | chamber state machine | on state transition |
| Context prompt | nearest valid interaction | when target changes |
| ACT enabled | target/capability state | each fixed step, DOM only on change |
| REWIND enabled | mode + commit policy | on state transition |
| Link indicator | active actor → mechanism relationship | on relationship change |
| Result stats | frozen score record | once at completion |

## Design tokens

Use the values in `docs/07_ART_DIRECTION_STYLE_LOCK.md`. Core UI tokens:

```css
--void: #07090e;
--lacquer: #14131a;
--brass: #a77b3e;
--brass-light: #e6c978;
--porcelain: #e7e0d2;
--moon: #70879a;
--echo-cyan: #55d9e2;
--echo-violet: #9277e9;
--echo-amber: #e1b55a;
--jewel: #c8fff2;
--danger: #b94757;
```

Use system fonts to avoid loading risk. A classical system serif is acceptable for titles; system sans-serif for controls and data.

## Input details

- Joystick interaction zone: approximately 138 px, visible base about 104 px.
- ACT: 70–76 px.
- REWIND: 84–92 px because it is the signature action.
- Support joystick + ACT/REWIND simultaneously.
- Handle `pointercancel`, `lostpointercapture`, blur, and visibility change.
- Press feedback begins on pointer down, not after click.
- Prevent browser scroll, pinch zoom, selection, and long-press menus inside play.

## Accessibility

- Echo identity uses color plus slot position, trail shape, and a small crest/outline difference.
- Reduced motion shortens camera/effect motion but preserves visible state reversal.
- UI copy remains high contrast.
- Critical state changes use visual plus sound or haptic.
- Touch targets remain at least 64 CSS px.
- Do not put essential state only in a low-saturation color.

## What not to copy literally

The SVG scene in the prototype is not final art and must not be treated as a generated 3D object. The production implementation should copy layout, density, hierarchy, and interaction states while the actual room is rendered with verified 404 assets.

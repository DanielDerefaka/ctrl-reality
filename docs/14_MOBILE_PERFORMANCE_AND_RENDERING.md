# Mobile Performance and Rendering

## Official ceilings and internal targets

| Metric | Official ceiling | Internal target |
|---|---:|---:|
| Ready time | 20 s | under 5 s |
| Transfer | 10 MB | under 6 MB |
| Draw calls | 900 | under 250 |
| Triangles | 1,500,000 | under 300,000 |
| Console errors | 0 | 0 |
| Missing requests | 0 | 0 |

The internal targets create margin for device differences and future integration changes.

## Renderer setup

- `antialias: true` only if performance remains stable; compare against FXAA/no AA.
- Cap effective DPR:
  - phone low tier: 1.0–1.25,
  - phone normal: 1.5,
  - desktop: up to 2.0.
- Resize only when dimensions or DPR change.
- Prefer `SRGBColorSpace` and one deliberate tone-mapping choice.
- Avoid changing renderer settings every frame.
- Disable alpha canvas unless the HTML background is truly needed.

## Quality tiers

### Low mobile

- DPR 1.0.
- One shadow-casting key light.
- 1024 shadow map or lower.
- No bloom/composer.
- Reduced particles.
- Simplified echo afterimages.
- No secondary shadow cascade.

### Standard mobile

- DPR 1.5.
- Organizer rig phone tier or equivalent.
- Controlled shadows.
- CSS rewind wash.
- Full essential particles.

### Desktop

- DPR up to 2.
- Higher shadow map if needed.
- Optional restrained post effect.
- Same gameplay and asset set.

Auto-select using capability/performance, but expose a quality toggle in pause only if it is reliable.

## Draw-call control

- Reuse materials from a small palette.
- Instance repeated bolts, gear teeth, rail posts, and wall modules through the organizer-safe loader path.
- Merge static geometry only when material/attribute compatibility is confirmed.
- Use shared thief geometry for player and echoes.
- Avoid one material per tiny part.
- Keep transparent objects grouped and minimal.

## Triangle control

- Spend triangles on hero silhouette, door layers, and visible motion.
- Use broad bevels rather than dense tiny detail.
- Use cylinders with sensible radial segments at phone distance.
- Keep hidden backs/interiors simple unless visible during animation.
- Do not generate excessive gear teeth that become sub-pixel.

## Lighting

- Test organizer `rig.js` on the real scene and measure cost.
- The rig may redraw the world for cascades/composer; use its phone tier if needed.
- Keep one shadow-casting key as the default fallback.
- Use unshadowed accent lights sparingly.
- Bake visual “light sources” into emissive materials but ensure actual surfaces receive light.
- Verify the floor under both warm key and cool fill.

## Loading

- Local Three.js module.
- No runtime image textures unless essential.
- Code assets import in parallel where safe.
- Show title/start UI immediately, but set `__READY__` only when playable.
- Fail visibly on missing P0 asset rather than silently loading an empty room.
- Log one actionable error with asset ID.

## Main-loop allocation rules

Avoid per-frame creation of:

- `Vector2`, `Vector3`, `Quaternion`, `Matrix4`,
- arrays for nearby actors,
- material clones,
- particle objects,
- DOM nodes.

Create scratch objects once and reuse them.

## Visibility and culling

The vault is compact, so sophisticated occlusion is unnecessary. Use:

- frustum culling,
- manual visibility for chamber-only objects,
- disable decorative animation outside active chamber,
- pause rendering when page is hidden, but reset real-time clocks on resume.

## Touch and layout performance

- Use `touch-action: none` on game controls/canvas.
- Pointer listeners should be non-passive only where `preventDefault` is required.
- Do not update DOM text every frame unless value changed.
- Timer ring can update at 10–20 Hz while gameplay remains 60 Hz.
- Use transform/opacity for UI animation, not layout-heavy properties.

## Profiling routine

At each milestone:

1. Open 390 × 844 viewport.
2. Apply CPU slowdown when available.
3. Play a full chamber with three echoes.
4. Record median/min FPS, peak draw calls, peak triangles, long tasks, memory growth.
5. Trigger ten rewinds to find leaks.
6. Restart chamber ten times.
7. Background and foreground the tab.
8. Rotate viewport once and return to portrait.
9. Test on physical Android device.

## Performance fail conditions

- FPS declines after every rewind.
- Echo creation permanently increases active interaction listeners.
- Particle pool grows without bound.
- Draw calls exceed internal target without a documented visual reason.
- A production asset imports but renders empty.
- Ready time depends on an external CDN.
- Device orientation causes controls to overlap the play area.

## Pre-ship commands

Use the current official recipe commands. The documented flow includes:

```bash
node harness/ship.mjs /absolute/path/to/game --stamp
node harness/live.mjs https://YOUR-LIVE-URL/
node harness/live.mjs https://YOUR-LIVE-URL/ --desktop
node harness/jam.mjs https://YOUR-LIVE-URL/ --commit=YOUR_SHA
```

Do not rely on local success. Test the exact deployed URL and exact submitted commit.

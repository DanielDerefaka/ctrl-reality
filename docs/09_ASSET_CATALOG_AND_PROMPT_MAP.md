# Asset Catalog and Prompt Map

Detailed prompts for each asset live under `prompts/assets/`. This catalog controls priority, dimensions, moving parts, and budget.

## Budget philosophy

A small strong set is better than a large mediocre set. Use geometry where it affects silhouette, animation, or material breakup. Avoid invisible interior detail.

| Priority | Asset | Qty in scene | Triangle target per unique asset | Animated parts |
|---|---|---:|---:|---|
| P0 | Porcelain thief | 1 + up to 3 shared-geometry echoes | 8k–22k | head, arms, legs, chest key |
| P0 | Pressure plate | 1–2 | 2k–8k | top, springs, inner ring |
| P0 | Vault gate/door | 1–2 | 8k–24k | rings, pins, leaves |
| P0 | Crank station | 1 | 4k–12k | handle, axle, gear train |
| P0 | Clock-face floor/ring | 1 | 8k–30k | rotating inlay/ring |
| P0 | Sweeping second hand | 1 | 1k–5k | main pivot, counterweight |
| P0 | Jewel pedestal | 1 | 4k–14k | petals, lift, jewel socket |
| P0 | Brass arch/wall | repeated modules | 3k–10k | optional pin strips |
| P1 | Pendulum | 1 | 2k–8k | arm, bob, escapement |
| P1 | Locking lever | 1 | 2k–6k | lever, teeth, latch |
| P1 | Exit hatch/lift | 1 | 5k–14k | iris leaves or platform |
| P1 | Gear cluster | 2–4 instances | 3k–12k | gear pivots |
| P1 | Rail/support module | repeated | 1k–5k | none |
| P2 | Clockwork bird | 1 | 5k–15k | head, wings, tail |

Shared geometry and instancing should keep total triangles well under 300,000 and draw calls under 250 in the internal target build.

## P0 asset acceptance criteria

### Porcelain thief

- Reads as an elegant thief at 50–80 px tall.
- Large head/face silhouette, no detailed facial texturing.
- Separate limb groups with usable pivots.
- Distinct chest key or winding mechanism.
- Does not resemble an existing trademarked character.
- Same geometry supports all echo materials.

### Pressure plate

- Visibly depresses by 0.12 m.
- Springs or gear teeth communicate physical activation.
- Clear center region for actor placement.
- Silhouette remains circular and readable under the fixed camera.

### Vault gate

- Clearly blocks the path when closed.
- Uses two or three major motions, not dozens of tiny parts.
- Locking pins are visible from the play camera.
- Open state creates a generous 1.55 m passage.

### Crank

- Handle is obvious from the play camera.
- Hand contact point is approximately 0.8–1.0 m high.
- Separate handle, axle, and visible response gear.
- Rotation remains visually smooth on phone.

### Clock floor

- Provides a readable playable surface.
- Has concentric bands and broad inlays, not tiny engraved text.
- Floor material catches both warm and cool light.
- Collision remains simple despite visual detail.

### Second hand

- Thin but unmistakable.
- Counterweight communicates pivot.
- Red danger accent appears only while hazardous.
- Shadow/sweep remains visible against the floor.

### Pedestal and jewel

- Pedestal opens in a short mechanical-flower movement.
- Jewel is the brightest small object in the scene.
- Facets read without expensive full transmission.
- Object remains original and logo-free.

### Arch/wall module

- Tiles without obvious seams.
- Provides strong radial silhouette.
- Has recesses for warm light sources.
- Does not steal detail from hero/objective.

## Named moving parts

Use these names unless the generated asset requires a documented alternative:

```text
thief:
  headPivot
  torso
  leftUpperArm
  leftForearm
  rightUpperArm
  rightForearm
  leftThigh
  leftShin
  rightThigh
  rightShin
  chestKey

plate:
  plateTop
  springGroup
  indicatorRing

vaultDoor:
  outerRing
  innerRing
  lockingPins
  leftLeaf
  rightLeaf

crank:
  handlePivot
  handleGrip
  axle
  responseGear

clockFloor:
  outerBand
  innerBand
  centerDial

secondHand:
  handPivot
  handBlade
  counterweight

pedestal:
  petalGroup
  liftColumn
  jewelSocket
  jewel

pendulum:
  armPivot
  arm
  bob
  escapement
```

## Integration rule

Every production asset gets an adapter test that:

1. imports it,
2. confirms it returns an Object3D,
3. checks expected part names,
4. checks bounds and base,
5. animates each required pivot through a small range,
6. renders at the actual camera distance.

## Prompt files

- `prompts/assets/01_PORCELAIN_THIEF.md`
- `prompts/assets/02_PRESSURE_PLATE.md`
- `prompts/assets/03_VAULT_DOOR.md`
- `prompts/assets/04_CRANK_STATION.md`
- `prompts/assets/05_CLOCK_FLOOR.md`
- `prompts/assets/06_SECOND_HAND_HAZARD.md`
- `prompts/assets/07_JEWEL_PEDESTAL.md`
- `prompts/assets/08_ARCH_WALL_MODULE.md`
- `prompts/assets/09_PENDULUM.md`
- `prompts/assets/10_LOCKING_LEVER.md`
- `prompts/assets/11_EXIT_HATCH.md`
- `prompts/assets/12_GEAR_CLUSTER.md`

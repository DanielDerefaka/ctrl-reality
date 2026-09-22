# Asset 06 — Sweeping Second Hand Hazard

## Purpose

Physicalizes time and creates a readable angular hazard. It is both a gameplay obstacle and the visual centerpiece of rewind.

## Dimensions

- Pivot height: 0.16 m above floor.
- Reach: 5.2 m from center.
- Hazard width: 0.20–0.28 m visually; analytic collision may be slightly forgiving.

## Reference-image prompt

Isolated giant ornate but restrained pocket-watch second hand mechanism for a miniature clockwork vault, long aged-brass tapered hand with broad readable spine, ivory porcelain counterweight, dark central hub, jewel-glass tip, art-deco geometry, no numerals or text, designed as a floor-level sweeping obstacle, complete uncropped object, neutral studio background, three-quarter view.

## Named parts

`root`, `hub`, `handPivot`, `handBody`, `counterweight`, `tipLens`, `driveGear`.

## Candidate strategies

- A: elegant tapered brass hand with porcelain counterweight.
- B: heavier mechanical beam with visible linkage.
- C: simplified high-readability blade/needle with premium materials.

## Animation acceptance

- `handPivot` rotates around exact floor center.
- Reverse animation is smooth and deterministic.
- Tip lens/trail can signal direction without excessive particles.
- Visual width and collision width are documented separately.

## Budget target

- Under 4k triangles.
- Under 5 draw calls.

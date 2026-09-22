# Asset 09 — Heart Pendulum

## Purpose

Final chamber timing hazard and visual anchor. It should move slowly enough to read and cast a controlled moving shadow.

## Dimensions

- Visible support height: 3.4 m.
- Arm length: 2.6 m.
- Bob diameter: 0.65 m.
- Clearance path must be obvious.

## Reference-image prompt

Isolated monumental pendulum assembly for a miniature clockwork vault, dark lacquer suspension arch, long aged-brass rod, heavy ivory porcelain and brass lens-shaped bob with pale jewel inset, broad art-deco forms, exposed pivot bearings and gear sector, theatrical but restrained, complete object, three-quarter view, neutral studio background, no text.

## Named parts

`root`, `supportArch`, `pivot`, `rod`, `bob`, `gearSector`, `counterGear`, `jewelInset`.

## Candidate strategies

- A: classic long pendulum with luxury porcelain bob.
- B: double-arm escapement silhouette.
- C: compact theatrical guillotine-like arc with best gameplay readability.

## Animation acceptance

- Pivot at the real suspension point.
- Deterministic angle from simulation time, not accumulated frame delta.
- Reverse motion follows the same timing function.
- Collision uses an analytic swept capsule, not mesh collision.

## Budget target

- Under 9k triangles.
- Under 7 draw calls.

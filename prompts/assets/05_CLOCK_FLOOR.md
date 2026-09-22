# Asset 05 — Living Clock-Face Floor

## Purpose

Defines the entire board, supports navigation, communicates loop time, and transforms during rewind. Must remain readable in a dark palette.

## Dimensions

- Playable disk radius: 6.0 m.
- Decorative outer ring radius: 6.6 m.
- Height variation under 0.18 m on playable surface.

## Reference-image prompt

Isolated top-down three-quarter view of a circular miniature pocket-watch vault floor, dark lacquered stone-metal disk with broad aged brass concentric rings, ivory porcelain hour inlays without numbers, clean radial seams, restrained art-deco linework, exposed edge gear teeth and a few inset jewel-glass channels, clear uncluttered walkable center, warm light under ring gaps, cold moonlit outer rim, complete circular object on neutral background, no text or numerals.

## Named parts

`root`, `baseDisk`, `outerRing`, `middleRing`, `innerRing`, `hourInlays`, `lightChannels`, `edgeGearRing`, optional `sector01` etc. only if needed for animation.

## Candidate strategies

- A: layered watch-dial rings and broad hour inlays.
- B: radial mechanical theatre stage with moving sectors.
- C: minimal dark disk with premium brass tracks and glowing time channel.

## Animation acceptance

- At least two rings can counter-rotate subtly during rewind.
- Loop progress can drive a restrained light sweep without dynamic geometry creation.
- Walkable surface has enough value contrast for the player and echo trails.
- No thin decorative grooves that shimmer on phone.

## Budget target

- Under 20k triangles for the full floor.
- Under 10 draw calls after safe batching/shared materials.

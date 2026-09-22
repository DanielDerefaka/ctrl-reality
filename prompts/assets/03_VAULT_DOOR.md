# Asset 03 — Iris Vault Gate

## Purpose

Primary gate and dramatic final vault face. The opening state must be legible from the gameplay camera, with visible mechanical causality.

## Dimensions

- Passage clear width: 1.55 m.
- Passage clear height: 1.85 m.
- Outer frame: about 2.7 m wide × 2.45 m high × 0.55 m deep.
- Origin at floor center beneath passage.

## Reference-image prompt

Isolated miniature art-deco clockwork iris vault gate, dark lacquered structural arch, aged satin brass outer and inner rotating rings, six broad ivory porcelain iris leaves, visible locking pins and gear teeth, warm inner mechanism light, strong circular silhouette, openable human-sized central passage, three-quarter front view, complete uncropped object, neutral background, no text, no bank logo, no modern keypad.

## Named parts

`root`, `frame`, `outerRing`, `innerRing`, `irisLeaf01` through `irisLeaf06`, `lockingPin01` through `lockingPin04`, `leftGearTrain`, `rightGearTrain`, `threshold`, `indicatorLens`.

## Candidate strategies

- A: six-leaf iris with layered rings.
- B: two split semicircular leaves with large visible bolts and radial locks.
- C: compact circular portcullis using rotating spoke segments.

## Animation acceptance

- 0–1 open amount drives rings, pins, and leaves with no clipping in normal view.
- Passage collision can use a separate analytic segment/box.
- Open state is obvious even when player stands nearby.
- Final version supports a larger jewel-vault variant through scale or parameter.

## Budget target

- Under 18k triangles.
- Under 12 draw calls.

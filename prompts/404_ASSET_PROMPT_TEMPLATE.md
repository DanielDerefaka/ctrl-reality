# 404 Asset Prompt Template

Copy this template for any new object. Do not omit the shared style sentence.

## Asset identity

- **Asset ID:** `[kebab-case-id]`
- **Gameplay purpose:** `[what the player reads/does with it]`
- **Target dimensions:** `[width × depth × height in metres]`
- **Gameplay camera importance:** `[hero / mechanism / environment]`
- **Moving parts and pivots:** `[named list]`

## Shared style lock — copy verbatim

> A miniature theatrical pocket-watch vault made from lacquered near-black metal, aged satin brass, ivory matte porcelain, and jewel-like glass, built with clean art-deco geometry, broad readable bevels, exposed mechanical joints, and restrained ornament, lit by warm internal mechanism light against cold moonlit shadows, with no printed labels, no grime-heavy realism, no modern electronics, and no visual clutter.

Palette and scale must match `docs/07_ART_DIRECTION_STYLE_LOCK.md`.

## Reference-image brief

Create one isolated three-quarter reference image of `[object]` on a neutral matte background. Show the complete silhouette with nothing cropped, even studio lighting, no cast clutter, no text, no UI, no other props, and enough separation to identify every major part. Use the exact materials and proportions below:

- `[material/proportion detail]`
- `[material/proportion detail]`
- `[material/proportion detail]`

This image is reference only. It must not be shipped as a 3D mesh.

## 404 generation instruction

Using the connected organizer 404 asset workflow and current asset contract, generate a self-contained JavaScript module that returns a `THREE.Group` representing `[object]`.

Requirements:

- Code-generated Three.js geometry only.
- No external mesh/model file.
- No base64/binary/hidden vertex data.
- Broad readable forms before micro-detail.
- Correct real-world dimensions and origin.
- Named child groups for every animated or material-swapped part.
- Pivots positioned for real gameplay animation.
- Materials follow the shared palette.
- Sensible segment counts and mobile budget.
- Front direction is documented.
- Shadows enabled only where useful.
- No text, logos, trademarked symbols, or modern electronics.

## Three independent candidates

Generate independently:

- **Candidate A — architectural:** strong art-deco silhouette, layered panels, restrained mechanics.
- **Candidate B — kinetic:** moving mechanism and exposed function dominate the silhouette.
- **Candidate C — minimal theatrical:** simplest readable shape with premium material separation and broad bevels.

Do not derive B and C by editing A. Preserve all sources and verification renders.

## Verification

Render each candidate from:

- front,
- rear,
- left,
- right,
- top,
- three-quarter,
- actual game camera,
- silhouette-only view when available.

Inspect:

- resemblance to reference,
- scale,
- silhouette at phone size,
- material hierarchy,
- no floating/intersecting pieces,
- no paper-thin hidden surfaces,
- pivot behavior,
- draw calls and triangle count,
- compliance scan.

## Selection question

Which candidate most clearly communicates `[gameplay function]` in the actual 390 × 844 camera while looking like it belongs to the same authored vault as the other selected assets?

Record why the other two were rejected. Do not select by numeric complexity alone.

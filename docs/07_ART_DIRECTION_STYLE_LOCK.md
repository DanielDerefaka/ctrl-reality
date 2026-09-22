# Art Direction and Style Lock

This file is the canonical style lock. Every agent, MCP call, image-reference prompt, asset candidate, UI task, lighting task, and critic must receive the same style sentence, palette, and dimensions. Do not casually rewrite it during production.

## One style sentence

> A miniature theatrical pocket-watch vault made from lacquered near-black metal, aged satin brass, ivory matte porcelain, and jewel-like glass, built with clean art-deco geometry, broad readable bevels, exposed mechanical joints, and restrained ornament, lit by warm internal mechanism light against cold moonlit shadows, with no printed labels, no grime-heavy realism, no modern electronics, and no visual clutter.

## Visual keywords

- miniature diorama,
- clockwork jewelry box,
- art-deco geometry,
- broad bevels,
- strong silhouette,
- readable moving parts,
- satin metal,
- matte porcelain,
- black lacquer,
- controlled theatrical light,
- precise rather than steampunk-chaotic.

## Explicit no-go list

- generic steampunk clutter,
- rusty scrap-yard materials,
- Victorian pipes everywhere,
- tiny unreadable gears covering every surface,
- modern LEDs or screens,
- photoreal humans,
- cartoon toy proportions,
- flat-shaded low-poly default look,
- neon cyberpunk palette,
- printed text on 3D props,
- logos,
- trademarked design language,
- giant empty black floor,
- one-color lighting,
- bloom that destroys edges.

## Palette

| Token | Hex | Use |
|---|---|---|
| Void | `#07090E` | surrounding darkness |
| Lacquer | `#14131A` | structural shells and floor recesses |
| Lacquer highlight | `#292632` | bevels and raised bands |
| Aged brass | `#A77B3E` | primary mechanisms |
| Brass light | `#E6C978` | worn edges and lit accents |
| Brass shadow | `#5E4025` | cavities and underside |
| Porcelain | `#E7E0D2` | thief body and echo body |
| Porcelain shade | `#AAA4A0` | joint shadows |
| Moon steel | `#70879A` | cool environmental accents |
| Danger | `#B94757` | hazard seam and failure pulse |
| Echo cyan | `#55D9E2` | Second Hand 1 / circle |
| Echo violet | `#9277E9` | Second Hand 2 / triangle |
| Echo amber | `#E1B55A` | Second Hand 3 / diamond |
| Jewel core | `#C8FFF2` | Chronoglass center |
| UI ink | `#F4EEDC` | primary UI text |
| UI muted | `#9B99A4` | secondary UI text |

Do not add another saturated gameplay color without a documented reason.

## Material system

### Lacquered structure

- `MeshStandardMaterial` or equivalent.
- Roughness approximately 0.28–0.42.
- Metalness 0.45–0.65.
- Broad highlights, not mirror black.
- Use geometry bevels and layered panels for readability.

### Aged satin brass

- Roughness 0.24–0.38.
- Metalness 0.85–1.0.
- Variation comes from separate part colors and light, not texture noise.
- Bright edge pieces may use the brass-light token.

### Porcelain

- Roughness 0.6–0.78.
- Metalness 0.
- Warm ivory, not pure white.
- Joint sockets and face recesses use porcelain shade or lacquer.

### Echo treatment

- Reuse the same thief geometry.
- Do not create separate mesh assets.
- Reduce opacity only moderately; preserve silhouette.
- Add colored inner-core material, edge/rim effect, and a thin route filament.
- Use circle/triangle/diamond UI shape in addition to color.
- Avoid additive transparency layers that double over and turn white.

### Chronoglass

- Small focal object.
- Use layered code geometry rather than a heavy transmission material on low-end phone.
- Core: pale cyan emission.
- Outer facets: transparent or semi-transparent only if performance remains stable.
- It must remain bright without large full-screen bloom.

## Scale lock

World units are meters.

| Object | Real-world target |
|---|---:|
| Porcelain thief height | 1.05 m |
| Thief shoulder width | 0.34 m |
| Pressure plate diameter | 1.35 m |
| Pressure plate travel | 0.12 m |
| Crank overall height | 1.10 m |
| Crank handle radius | 0.42 m |
| Standard gate opening | 1.55 m wide × 1.85 m high |
| Vault ring outer diameter | 12.0 m |
| Floor thickness | 0.45 m |
| Sweeping hand length | 5.2 m |
| Pendulum bob height | 1.25 m |
| Jewel pedestal height | 1.10 m |
| Chronoglass jewel | 0.34 m tall |
| Decorative gear cluster | 0.8–1.8 m diameter |
| Brass arch module | 2.4 m high |

Every asset receipt must state its intended dimensions.

## Shape language

- Primary structures: circles, radial bands, stepped arches.
- Hero and jewel: vertical teardrop and faceted oval forms.
- Interactables: one dominant handle or contact surface.
- Hazards: long, thin, unmistakable sweep silhouettes.
- Fasteners: oversized enough to read at phone scale.
- Bevel widths: approximately 2–5 cm in world scale on major parts.
- Avoid details smaller than about 2 cm unless they contribute to silhouette.

## Camera and composition lock

- Portrait target: 390 × 844.
- Three-quarter camera; no free rotation.
- Approximate vertical angle: 38–45 degrees.
- Player should measure 12–18% of frame height.
- Active objective should sit within the central 60% of the screen.
- Keep the lower-left and lower-right corners available for touch controls.
- Do not place critical mechanisms under controls.
- Frame at least one curved vault boundary to communicate scale.
- Keep the surrounding void dark enough to isolate the set, but never lose the floor.

## Lighting lock

### Warm key

- Warm mechanism source around 2800–3400 K equivalent.
- Comes from inside the watch/vault, slightly low and lateral.
- Defines brass edges and the objective path.

### Cool fill

- Cool sky/moon source around 6500–9000 K equivalent.
- Fills porcelain and shadow sides.
- Echoes should belong to this family.

### Rim/accent

- Small controlled rim on player and objective.
- Danger uses red reflected light only near active hazards.

### Exposure

- No crushed black floor.
- No clipped brass highlight dominating the frame.
- The jewel may be the brightest localized object.
- The UI should not be the brightest element during normal play.

Use the organizer’s lighting rig if it performs well, with its mobile tier. Measure its draw-call cost before committing.

## Motion language

- Heavy mechanisms: 180–450 ms ease with a short settling movement.
- Player: quick anticipation, direct travel, small head lead.
- Echo: same motion plus slight 30–50 ms trailing filament.
- Rewind: global reverse motion with a clean 0.9-second rhythm.
- Avoid constant camera shake, floating bob on every UI element, or excessive particles.

## Stage-one frame claims

A critic may fail a round when any of these are false:

1. The hero is readable at phone size.
2. The floor has a visible material and receives light.
3. Warm and cool light are both present.
4. The objective is visually prioritized.
5. The frame contains purposeful mechanical motion.
6. At least one echo remains distinct from the current player.
7. UI does not cover the mechanic.
8. No development placeholder is visible.
9. The image remains readable during the hazard’s darkest phase.
10. The scene reads as one authored set rather than unrelated generated objects.

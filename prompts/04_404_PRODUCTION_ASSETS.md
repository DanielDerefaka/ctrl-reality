# Session 04 — 404 Production Asset Generation and Integration

## Objective

Replace temporary P0 geometry with a coherent family of verified 404-generated Three.js code assets while preserving gameplay and performance.

## Before generating

1. Read `docs/07_ART_DIRECTION_STYLE_LOCK.md` exactly.
2. Read `docs/08_404_ASSET_PIPELINE.md`.
3. Read `docs/09_ASSET_CATALOG_AND_PROMPT_MAP.md`.
4. Inspect and record the actual available 404 MCP tools and schemas.
5. Read the current organizer asset contract, generation commands, verifier, and shipping scanner.
6. Create `production/asset-receipts/` if missing.
7. Do not alter gameplay while generating assets except for view adapters and pivots.

## P0 order

Generate and integrate in this order:

1. Porcelain thief.
2. Pressure plate.
3. Vault gate/door.
4. Clockwork floor.
5. Crank station.
6. Sweeping second hand.
7. Jewel pedestal and Chronoglass.
8. Arch/wall kit.
9. Locking lever.
10. Exit hatch.

Pendulum and decorative gear cluster are P1.

## Per-asset loop

For each asset:

1. Open its file in `prompts/assets/`.
2. Create or select one clean reference image.
3. Record reference provenance.
4. Generate Candidate A, B, and C independently. Do not mutate one candidate three times and call them independent.
5. Ensure each exports the current organizer contract and returns a `THREE.Group`.
6. Verify from front, rear, left, right, three-quarter, top, and gameplay camera where supported.
7. Check scale against the style-lock measurements.
8. Check silhouette at 390 × 844.
9. Check moving-part pivots and named groups.
10. Check no hidden or forbidden mesh source exists.
11. Compare the candidates in one contact sheet.
12. Select one by eye with a written reason.
13. Preserve rejected source and renders outside the active game asset manifest.
14. Integrate the selected asset through a view adapter.
15. Run unit tests, custom gate, performance snapshot, and shipping scanner.
16. Commit asset + receipt together.

## Receipt minimum

Every asset receipt must contain:

- asset ID and gameplay purpose,
- shared style-lock version/commit,
- reference image path and source/tool,
- exact generation prompt,
- actual MCP/tool/model used,
- candidate source paths and commit IDs,
- verifier command and output paths,
- visual comparison,
- selection and rejection reasons,
- moving child group names,
- dimensions, draw calls, triangles,
- integration screenshot,
- test/gate result.

## Integration rules

- Keep collision analytic and independent from generated visual geometry.
- Use shared materials or palette factories where the organizer contract permits.
- Clone the selected group safely for echoes.
- Ensure echo material overrides do not mutate the player’s original materials.
- Do not add separate production objects merely to decorate empty space.
- Merge only static decorative geometry when it does not damage editability or named moving parts.
- Use correct `castShadow`/`receiveShadow` settings selectively.

## Acceptance checks

- [ ] No prototype-only geometry is visible in the playable path.
- [ ] Every visible 3D object appears in a receipt and provenance list.
- [ ] Every P0 asset has three independent candidates and verifier output.
- [ ] Player, mechanisms, and objective remain readable on phone.
- [ ] Custom gate still passes.
- [ ] Internal performance targets still pass or have written mitigation.
- [ ] Organizer ship/scanner reports no unexplained suspicious modules.

## Commit pattern

```text
asset: select verified porcelain thief
asset: select verified pressure plate
...
```

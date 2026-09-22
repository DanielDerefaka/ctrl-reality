# 404 Asset Pipeline

## Purpose

The competition’s hard rule is also an opportunity: every object can remain editable code, use named moving parts, and participate in the rewind. The goal is not to hide the method. The goal is to demonstrate it at high quality.

## Production asset definition

A production asset is a JavaScript module that:

- exports a generator function,
- receives `THREE`,
- returns a `THREE.Group` or valid `Object3D`,
- creates geometry with Three.js constructors and operations,
- uses real-world meters,
- is centered according to the organizer contract,
- has its base at `y = 0` where appropriate,
- has named child groups for moving parts,
- contains no downloaded mesh or concealed mesh data.

Always follow the current organizer asset contract over this summary.

## Pipeline overview

```text
STYLE LOCK
  → REFERENCE IMAGE
  → CANDIDATE A / B / C
  → SYNTAX + CONTRACT CHECK
  → FOUR-SIDE + 3/4 VERIFICATION
  → VISUAL SELECTION
  → PIVOT / NAMING PASS
  → IN-GAME INTEGRATION
  → MOVING-FRAME REVIEW
  → RECEIPT + COMMIT
```

## Step 1 — Reference image

A usable reference should show:

- one object filling most of the frame,
- plain neutral background,
- clean three-quarter view,
- even light,
- no cropping,
- no text or logo,
- the exact shared style,
- clear separation of moving parts.

For animated objects, make the reference show the neutral/base pose and explain the joints in the asset prompt.

Store references under:

```text
production/assets/<asset-slug>/reference/
```

Record whether the reference was made with Atlas, another declared image generator, or original artwork.

## Step 2 — Three independent candidates

Independence means construction strategy, not three color tweaks.

Suggested candidate families:

- **A: primitive assembly** — boxes, cylinders, cones, spheres, torus parts.
- **B: profile construction** — lathe, extrude, shape-based sweeps.
- **C: alternate part breakdown** — different layering, joinery, or interpretation.

For obvious boxy joinery, use two genuinely different part breakdowns rather than forcing an inappropriate lathe. For circular profiled objects, use at least one lathe/extrude candidate.

Write each candidate to:

```text
production/assets/<asset-slug>/candidates/<asset-slug>_a.js
production/assets/<asset-slug>/candidates/<asset-slug>_b.js
production/assets/<asset-slug>/candidates/<asset-slug>_c.js
```

## Step 3 — Use the 404 MCP correctly

When the organizer MCP is available:

1. Let Codex inspect the actual tool list.
2. Use the exact tool schema returned by the MCP.
3. Pass the style sentence, reference, dimensions, part names, and asset contract.
4. Request code only if the tool expects a code-generation prompt.
5. Run three independent generations.
6. Save raw outputs before editing.
7. Document tool and model identifiers in the receipt.

Do not invent a tool call in documentation or commit a fake result. The competition rules care about the recipe and shipped geometry; the receipt should accurately say how each candidate was produced.

## Step 4 — Verify

From the official recipe repository, run the current verifier. The documented pattern is:

```bash
node harness/verify.mjs <candidate-directory>
node harness/verify.mjs <candidate-directory> --size=560
```

The verifier checks syntax, object return type, bounds, real-world size, ground placement, and runaway triangle counts. It renders multiple views because a model that looks correct only from the reference angle is not acceptable.

Inspect:

- front,
- back,
- left,
- right,
- three-quarter view,
- bounding measurements,
- triangle count,
- base position.

## Step 5 — Pick by eye

Use this order:

1. Does the silhouette match the reference?
2. Do all sides remain intentionally modelled?
3. Are the functional parts obvious?
4. Does it obey the shared style?
5. Does it read at the game’s actual camera distance?
6. Are pivots and part breakdown suitable for animation?
7. Is the complexity reasonable?

Do not let the lowest triangle count beat a visibly stronger candidate when both fit the budget. Do not let a huge, broken candidate win because a metric rewards detail.

## Step 6 — Production cleanup

Allowed cleanup:

- rename groups,
- correct pivot positions,
- adjust scale to contract,
- fix material tokens,
- fix rotations and ground placement,
- merge or instance repeated safe geometry,
- remove invisible or redundant parts,
- add userData metadata,
- expose named moving components.

Do not manually replace the candidate with an unrelated asset and still claim the original generation receipt.

## Step 7 — Integration contract

Each selected module should expose or name moving parts consistently. Example:

```js
const group = new THREE.Group();
group.name = 'vaultDoor';

const outerRing = new THREE.Group();
outerRing.name = 'outerRing';

group.add(outerRing);
group.userData.parts = {
  outerRing,
  innerRing,
  lockingPins,
  leftLeaf,
  rightLeaf,
};

return group;
```

Gameplay code should access parts through an adapter or `userData.parts`, not by relying on `children[6]`.

## Step 8 — In-game review

An isolated verifier sheet is not the final test. Review the asset:

- at phone resolution,
- under production light,
- in motion,
- partially occluded,
- with UI visible,
- during rewind,
- beside other selected assets.

An individually strong object can still fail the set through scale, material, or detail mismatch.

## Step 9 — Receipt

Copy `production/ASSET_RECEIPT_TEMPLATE.md` to the asset folder. Record:

- asset name and purpose,
- reference provenance,
- exact style lock version,
- dimensions,
- generation path and tool/model,
- candidate strategies,
- verifier outputs,
- selected candidate,
- rejection reasons,
- cleanup changes,
- in-game screenshots,
- commit SHA.

## Priority batching

### P0 generation batch

1. Porcelain thief.
2. Pressure plate.
3. Vault gate/door.
4. Crank.
5. Clock-face floor/ring.
6. Sweeping second hand.
7. Jewel pedestal and jewel.
8. Wall/arch module.

### P1 batch

9. Pendulum.
10. Locking lever.
11. Exit hatch/lift.
12. Decorative gear cluster.
13. Rail/support module.

### P2 batch

14. Clockwork bird guide.
15. Display case or rope barrier.
16. Extra decorative mechanisms.

Do not generate P2 until all P0 assets are selected, integrated, animated, and tested on phone.

## Performance cautions from the organizer workflow

- Use the provided asset loader for instanced geometry; naive cloning can collapse instances.
- Be careful when merging geometries with different attribute sets, especially vertex color.
- Parse every module before shipping.
- A failed asset import can silently leave an empty scene while performance tests still pass.
- Printed text does not work well in this geometry-only format; keep text in HTML UI.
- The floor occupies much of the frame and must receive deliberate light.

## Final asset audit

Before submission:

- [ ] No mesh file exists in the game directory.
- [ ] No candidate production asset contains base64.
- [ ] No suspicious literal vertex data is present.
- [ ] Every active asset has a receipt.
- [ ] Every moving part has a stable name and correct pivot.
- [ ] Every asset passes verification.
- [ ] Every asset is visible and useful in at least one gameplay frame.
- [ ] The ship tool has no unresolved warnings.

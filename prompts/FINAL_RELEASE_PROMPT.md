# Codex Final Release Audit Prompt

Read `AGENTS.md`, `docs/20_DEFINITION_OF_DONE.md`, `checklists/PRE_SUBMISSION_CHECKLIST.md`, and the current organizer shipping/gate documentation.

Act as a release auditor, not a feature developer. Do not add new gameplay, assets, dependencies, or visual systems.

1. Determine the exact final candidate commit and live URL.
2. Run all unit, syntax, import, local gate, ship/scanner, live, official jam, and custom live checks documented for the project.
3. Audit the `game/` tree for forbidden model formats, remote runtime dependencies, undeclared files, prototype geometry, debug paths, stale cache references, secrets, and files reaching above the game folder.
4. Validate that `window.__READY__`, `window.__START__`, and `window.__GAME__` are truthful in the live build.
5. Compare final asset manifest with production receipts and provenance. Report any visible object without a receipt.
6. Verify submission JSON and PR body refer to the exact commit and URL tested.
7. Do not edit or paraphrase real gate output. Store it unmodified.
8. Make only release-blocking fixes, then rerun the affected complete checks.

Return:

- final commit,
- live URL,
- exact pass/fail table with command and artifact path,
- remaining deviations from internal targets,
- official-rule blockers if any,
- submission files ready/not ready,
- final release recommendation based only on evidence.

Never state that a physical-phone test occurred unless it was performed and logged by a human on a real device.

# Gate Run Log

Do not paraphrase a gate failure into a pass. Link the untouched output.

| Date/time WAT | Gate | Local/live | URL | Commit | Result | Ready | Transfer | Draws | Tris | Errors/404 | Raw output |
|---|---|---|---|---|---|---:|---:|---:|---:|---:|---|
|  | custom mechanic | local |  |  |  |  |  |  |  |  |  |
|  | official jam | live |  |  |  |  |  |  |  |  |  |
|  | custom mechanic | live |  |  |  |  |  |  |  |  |  |

## Required final evidence

- Three consecutive local custom passes.
- Official jam verdict against final HTTPS URL and final SHA.
- Custom gate pass against the same URL/SHA.
- Physical phone live run recorded separately.

## 2026-09-23 — Zero Hour foundation gate

- Local URL: http://127.0.0.1:4173/game/; branch feature/zero-hour-vertical-slice.
- Current custom browser entry: npm run smoke (tools/zero-hour-smoke.mjs). Final 34 passed / 0 failed, including actual left echo/right player shield break; console errors 0, missing/failed requests 0, outside-game requests 0. Raw receipts: production/zero-hour/browser-result.json and browser-output.txt.
- npm test: 35 passed / 0 failed. npm run check: 24 modules parsed / 25 local references verified, exit 0.
- Failed intermediate browser gate (30 passed / 1 failed) preserved in browser-round2-failed.json; pointer-capture exception corrected.
- Historical npm run gate still targets the old floor puzzle. It is not evidence for this pivot and was not claimed to pass. Official live jam gate and physical-phone gameplay remain unrun.
- Tested working tree is committed as pivot: establish Zero Hour third-person presentation foundation.

## 2026-09-23 — art pipeline scaffold checks

Recipe self-test passed, exit 0; intentionally invalid fixtures correctly warned. No NYRA_MASK verifier run, sheet, measurements or selected candidate. New offline pipeline tests 20/20; combined units 55/55; existing browser regression 34/34; static 24 modules/25 local references. Higgsfield and RunPod preflights both fail closed on absent credentials. No official live jam gate or generation success claimed. Details and raw outputs: production/MIDNIGHT_PIPELINE_REPORT.md and production/midnight-pipeline/.

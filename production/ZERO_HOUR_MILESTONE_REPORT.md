# Zero Hour presentation foundation report

Date: 2026-09-23. Working root: `/Users/dx/Documents/second-hands`.

1. **Branch / commit:** `feature/zero-hour-vertical-slice`. This report accompanies `pivot: establish Zero Hour third-person presentation foundation`. Resolve exact SHA with `git log -1 --format=%H --grep='^pivot: establish Zero Hour third-person presentation foundation$'`; it is reported in the session's final response. No self-referential fabricated SHA.
2. **Preserved floor:** `floor-prototype-v1` → `88be3bb47c45ac16f5c4d0acb5d61affec870a5f`. Its complete 23-unit/42-browser checks and desktop/390×844 captures are in `production/floor-build/`. Original history retained.
3. **Files:** New runtime `game/zero/{rules,scene,input,main}.js`; replaced active `game/main.js`, `game/index.html`, `game/styles.css`; new tests and `tools/zero-hour-smoke.mjs`; updated npm smoke entry, identity/design/style/UI/architecture/echo/asset-plan/definition docs, AGENTS/START_HERE/readmes and entry metadata. Older planning docs labelled superseded. New prompt, critic log and evidence/report. Complete committed file list: `git show --name-status HEAD`. Old floor helpers/tests retained.
4. **Flow:** Boot → live Command Bay Main Menu → Operations (Normal/Hard) → skippable Briefing → Gameplay → Pause → truthful evaluation Results. How, Settings, Credits and Back work. Results do not imply mission completion.
5. **Camera:** Fixed right shoulder, smooth follow, mouse/right drag, 52° normal/42° aim, wall segment collision, floor clearance. Ordinary hero height ~23%; near-wall zoom enlarges hero and uses transparency to retain target visibility. No free cinematic gameplay camera.
6. **Desktop:** WASD camera-relative movement; mouse look; left fire; right precision aim; Space dodge; Q record/store/deploy; E use; R reload; Escape pause. Sensitivity and invert-Y settings persist.
7. **Mobile:** Left stick, right drag, Fire/Echo/Dodge, contextual Use, Aim toggle, ammo-tap reload and Pause. 390×844 actual emulated touch flow/movement/cancel/fire-release checks pass. Aim assist is narrow and wall-occlusion-aware. Physical device, haptics and mobile full crossfire remain untested.
8. **Weapon:** Single pulse carbine; 24 magazine, 144 reserve, 0.14s cadence, 1.35s reload; hitscan damage/critical hits/death, muzzle/tracer/spark/hit markers, recoil/camera impulse, declared original procedural audio and supported enabled vibration. No inventory or extra weapon.
9. **Echo:** One stored/active recording, maximum six seconds; 30Hz transforms plus timestamped aim/fire/dodge/interactions and animation state. Kinematic noncolliding hologram replays shots, eligible scanner interaction and expires into cooldown. Desktop real-input left-recording/right-player crossfire broke shield; synchronized count 1. Pure tests reject same actor/direction/late fire. No state injection. Full scanner browser interaction and physical-phone crossfire need additional coverage.
10. **Scenes:** Command Bay, Skybridge and Security Spine prototypes; explicit spawns/objectives/encounters/interactions/lighting, owned cleanup. Scout defeat + real airlock interaction enters Spine. Three repeat menu/game cycles maintain one root and stable geometry count. Core/Extraction marked unavailable; no boss/extraction built. Bounded lifecycle check, not full memory profiler certification.
11. **Tests:** `npm test`: 35 passed / 0 failed, no skipped/cancelled. `npm run check`: 24 modules, 25 local references, pinned vendor match, no forbidden mesh files, exit 0. `npm run smoke`: 34 passed / 0 failed, exit 0. Includes actual desktop firing/target death/echo/crossfire and mobile touch menu/game flow. Initial new unit endpoint failure and pointer-capture browser failure documented and corrected, failed browser receipts retained.
12. **Console:** Final browser run 0 console/page errors.
13. **Requests:** Final run 0 failed/missing requests and 0 external/outside-game runtime requests.
14. **Screenshots:** Actual desktop 1440×900 and touch-emulated 390×844. See table below. Intermediate and failure frames retained with explicit names; no generated mockups.
15. **Performance:** Command Bay 106 draws / 1272 triangles; mobile Skybridge 76 draws / 1364 triangles; crossfire 96 draws / 1604 triangles. Local ready 138.2ms desktop / 74.7ms emulated phone, sampled ~60fps. Chrome153 on desktop Apple M5; these are snapshots, not peak/physical-phone claims. Pivot transfer size unmeasured.
16. **PROTOTYPE_ONLY:** Every 3D object: operative, weapon, backpack, targets/shield, decks/rails/walls/towers/doors/scanner, command bay, lights' visible fixtures and effects. No final 404 production object exists.
17. **Asset readiness:** Camera/movement/fire/drone-defeat/echo/crossfire/menu prerequisites pass for beginning a focused Section 1 reference/candidate workflow. First batch: operative, pulse carbine, backpack, scout, skybridge, tower wall, blast door, dropship doorway and lighting kit. Reinspect 404 tool availability and use official reference/three candidates/verification/visual selection/receipt workflow. No generation or verifier success claimed here.
18. **Largest visual weakness:** Rigid primitive character and repetitive box architecture; authored animation, material detail, weather and temporal-collapse atmosphere missing. Close-wall transparency is functional but visually rough.
19. **Largest gameplay weakness:** Stationary target encounters lack enemy offense, player damage/failure/retry and mission pacing. Health/damage values are truthful defaults, not evidence of implemented combat threat. No full core objective, boss, ranks or 8–10 minute mission yet.
20. **Section 1 readiness:** Ready to begin focused Section 1 production from this tested foundation. Not a finished Section 1 or complete vertical slice. Start with real-phone aim/control checks where available and the scout damage/defeat/retry loop; integrate only verified first-batch assets. Next prompt: `prompts/09_ZERO_HOUR_SECTION_1_PRODUCTION.md`.

## Screenshot index

Paths below are relative to repository root.

| View | File |
|---|---|
| Desktop menu | production/zero-hour/screenshots/menu-desktop.png |
| Desktop Operations / briefing | production/zero-hour/screenshots/operations-desktop.png; briefing-desktop.png in same directory |
| Desktop Skybridge | production/zero-hour/screenshots/skybridge-desktop.png |
| Target defeated | production/zero-hour/screenshots/drone-defeated-desktop.png |
| Active echo | production/zero-hour/screenshots/echo-desktop.png |
| Security Spine | production/zero-hour/screenshots/security-spine-desktop.png |
| Recorded left-side attack | production/zero-hour/screenshots/crossfire-record-left.png |
| Shield broken by crossfire | production/zero-hour/screenshots/crossfire-shield-broken.png |
| Truthful Results | production/zero-hour/screenshots/results-desktop.png |
| Mobile menu | production/zero-hour/screenshots/menu-mobile.png |
| Mobile Operations / briefing | production/zero-hour/screenshots/operations-mobile.png; briefing-mobile.png in same directory |
| Mobile Skybridge | production/zero-hour/screenshots/skybridge-mobile.png |
| Mobile recording / pause | production/zero-hour/screenshots/recording-mobile.png; pause-mobile.png in same directory |

Raw evidence: `production/zero-hour/unit-output.txt`, `check-output.txt`, `browser-output.txt`, `browser-result.json`. Visual limitations and corrective captures: `production/CRITIC_LOG.md`. Current browser suite replaces the old floor smoke entry; old floor puzzle gate is historical and was not passed against this runtime. No deployment or official live gate performed.

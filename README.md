# SECOND HANDS: ZERO HOUR

**YOUR BEST SQUADMATE IS YOU, SIX SECONDS AGO.**

A third-person action presentation foundation: live command bay, menu/operations/briefing, Skybridge target encounter, Security Spine crossfire evaluation, and a six-second holographic combat echo. This is not yet the full 8–10 minute mission. Every visible 3D object is PROTOTYPE_ONLY, disclosed in Credits.

## Run and test

Node >=22.12.0. Three.js stays pinned to 0.180.0; Puppeteer 25.11.0 is development-only.

```sh
npm install
npm run setup
npm test
npm run check
npm run serve
# In another terminal, with the server running:
npm run smoke
```

Open http://127.0.0.1:4173/game/ . Runtime dependencies remain entirely local under game/.

Desktop: WASD, mouse look, left fire, right precision aim, Space dodge, Q record/store/deploy, E interact, R reload, Escape pause. Mobile: joystick, right drag, Fire/Echo/Dodge/Aim/Use, ammo tap to reload and Pause. Sensitivity/invert/sound/haptics are in Settings.

To prove crossfire: record firing at the sentinel from its left, store, reposition right, deploy and fire while the echo attacks. Shield requires separate actors and sufficiently different directions within 0.8 seconds. The scanner is echo-eligible. Core encounter and final rank are unavailable; End Evaluation reports raw statistics and UNRANKED.

Floor history: `floor-prototype-v1`; preserved screenshots in production/floor-build/. Old `tools/floor-smoke.mjs` and `tools/second-hands-gate.mjs` apply to prior/future clockwork scaffolds, not this runtime. Current smoke is `tools/zero-hour-smoke.mjs`.

See production/ZERO_HOUR_MILESTONE_REPORT.md, CRITIC_LOG.md, TOOLING_LOG.md and PLAYTEST_LOG.md for exact evidence and limitations. Next prompt: prompts/09_ZERO_HOUR_SECTION_1_PRODUCTION.md.

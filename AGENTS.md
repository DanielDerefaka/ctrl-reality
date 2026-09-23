# AGENTS.md — SECOND HANDS: ZERO HOUR

## Current authority

The user's September 23 Zero Hour pivot replaces the previous Clockwork Heist mission, fixed camera, palette, controls and 20-second/three-echo design. Historical floor build: tag `floor-prototype-v1`. Never restore the old circular-room presentation as the submission.

Read START_HERE.md, docs/03_GAME_DESIGN_DOCUMENT.md, docs/05_CORE_LOOP_AND_MECHANICS.md, docs/07_ART_DIRECTION_STYLE_LOCK.md, docs/10_UI_UX_SPEC.md, docs/11_TECHNICAL_ARCHITECTURE.md, docs/12_REWIND_ECHO_TECH_SPEC.md and docs/20_DEFINITION_OF_DONE.md before extending the game. Read the adjacent official 404 recipe rules before production assets. Older dated pack material is historical planning, not the active brief.

## Mission and limits

One cinematic third-person over-the-shoulder action mission, target 8–10 minutes, with six-second combat echoes. Required sections: Skybridge Insertion, Security Spine, Chrono Core. Extraction is optional. The current milestone only builds Command Bay, Skybridge and Security Spine prototypes. Do not start the boss, extraction, extra weapons, multiplayer, inventory or a backend without the next task.

## Compliance

All final objects follow the official 404 reference → three independent candidates → multiple-angle verification → visual selection workflow. Keep rejected candidates, sources and receipts. No downloaded/imported meshes, GLB/GLTF/FBX/OBJ, concealed vertex data, base64 geometry, copied reference-game assets or fabricated 404 provenance. Mark ALL temporary geometry PROTOTYPE_ONLY. Inspect actual MCP tools and document availability before final asset work; never invent endpoints or successful calls. Keep style lock and palette identical across assets unless the user explicitly changes them.

## Engineering

Vanilla JavaScript ES modules and locally vendored Three.js. Fixed 60 Hz simulation; 30 Hz recording and timestamped shot/dodge/interaction events. One stored recording and one active noncolliding echo; expire at track end. Keep input, simulation, scene ownership and presentation separate. One render loop and one input listener set. Dispose scene geometries, materials, lights and pooled effects on transitions. Use stable actor and interaction IDs. Pause and clear all held input on blur/visibility loss. Preserve real development history.

## Controls and UI

Desktop: WASD movement, mouse look, left fire, right precision aim, Space dodge, Q record/store/deploy, E interact, R reload, Escape pause. Mobile: left stick, right drag, Fire/Echo/Dodge, contextual Use, Aim, ammo reload, Pause. Movement relative to camera; aim independent of travel. Configurable sensitivity/invert Y. Functional Boot → Menu → Operations → Briefing → Gameplay → Pause → Results flow. Minimum 64px targets and 12px essential text. Do not show debug labels or fake achievements; credits disclose prototypes and procedural audio. Core-secured and rank must remain truthful while the core section is unavailable.

## Evidence

Run unit/static/browser tests after meaningful implementation groups. Log failures as well as fixes. Browser touch emulation is not a physical-device test. Preserve production/floor-build/ and production/evidence/floor/. Maintain DECISION_LOG, TOOLING_LOG, PLAYTEST_LOG and CRITIC_LOG. Each milestone ends with actual screenshots, checks, a focused commit, and a report stating remaining prototype content, performance, risks and readiness. No claim of full completion while the current definition of done is false.

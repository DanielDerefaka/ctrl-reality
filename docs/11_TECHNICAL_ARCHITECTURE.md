# Zero Hour architecture

`game/main.js` imports `game/zero/main.js`. The Zero Hour runtime uses local Three.js and the existing FixedStepClock/FpsMeter. Existing floor/replay helper tests are retained as historical reusable logic.

- `zero/rules.js`: plain state, section definitions, weapon cadence/reload, six-second recording, immutable stored tracks, event playback, shield crossfire, statistics and segment/AABB collision.
- `zero/scene.js`: explicitly PROTOTYPE_ONLY geometry; one SectionManager owns the current root, walls, lights, actors, targets and fixed-size tracer/spark pool. Unload removes and disposes geometry/material/light resources.
- `zero/input.js`: one lifetime listener set, pointer ownership, keyboard/touch switching and cancellation. UI screens enable or disable gameplay input.
- `zero/main.js`: one requestAnimationFrame loop and fixed simulation; screen flow, follow/collision camera, shot ray tests, HUD, procedural audio and telemetry.

Section definitions include spawn, objective, encounter list, interaction registry, lighting token and bounds. Command Bay, Skybridge and Security Spine load. Chrono Core/Extraction are explicitly unavailable descriptors; requests fail rather than fabricate content. Scene transitions dispose render lists and reset camera/input/transient echoes.

`npm test` covers pure behavior; `npm run check` parses runtime and validates local dependencies; `npm run smoke` drives actual menus, mouse/touch combat, transitions and resource-count stability. No backend, runtime AI, imported mesh, external font or CDN. Pinned Three.js 0.180.0; Node >=22.12 for Puppeteer 25.11.0.

# Technical Architecture

## Architecture goals

- Deterministic enough for replay agents.
- Simple enough to finish in the remaining jam time.
- Mobile-first and self-contained.
- Easy for Codex to inspect, test, and modify.
- Production 3D assets remain individual source modules.
- No backend or runtime AI dependency.

## Recommended stack

- Vanilla JavaScript ES modules.
- Three.js.
- Static hosting.
- HTML/CSS overlay UI.
- Web Audio API for core sound; optional declared OGG music loop.
- Puppeteer through the organizer harness for custom gates.
- Node built-in test runner for pure logic.

Avoid React, a physics engine, ECS framework, backend, database, or multiplayer library. They add integration risk without helping the rubric.

## Repository tree

```text
second-hands/
  AGENTS.md
  README.md
  docs/
  production/
    asset-receipts/
    critic-rounds/
    gate-runs/
  game/
    index.html
    styles.css
    main.js
    config.js
    vendor/
      three.module.js
    assets/
      manifest.js
      thief.js
      pressure-plate.js
      vault-door.js
      crank.js
      clock-floor.js
      second-hand.js
      jewel-pedestal.js
      arch-wall.js
    core/
      fixed-step.js
      game-state.js
      telemetry.js
      reset-registry.js
    input/
      input-manager.js
      touch-controls.js
    systems/
      movement.js
      interaction.js
      recorder.js
      echo-player.js
      rewind-controller.js
      hazard.js
      scoring.js
      audio.js
      vfx.js
      save.js
    levels/
      chamber-01.js
      chamber-02.js
      chamber-03.js
    ui/
      ui-controller.js
  tools/
    second-hands-gate.mjs
  tests/
```

## Main runtime composition

`main.js` owns orchestration, not detailed logic.

```text
bootstrap
  → load local Three.js
  → create renderer, camera, scene
  → create lighting rig
  → load selected asset modules
  → construct chamber
  → initialize systems
  → set window.__READY__
  → wait for real Start tap
  → fixed-step update + render loop
```

## Component boundaries

### Renderer layer

Owns scene graph, camera, lighting, materials, and visual interpolation. It does not decide puzzle state.

### Game state

Plain JavaScript data that describes:

- current screen/state,
- chamber,
- loop time,
- current actor,
- persistent echo tracks,
- mechanism states,
- objective and completion,
- scoring.

### Systems

Pure or mostly pure logic that transforms game state. Examples: movement, recording, interaction, hazard, scoring.

### View adapters

Map logical state to asset part transforms. For example, `DoorView` maps `door.openAmount` to ring rotation and leaf positions.

This separation makes rewind/reset reliable. Do not treat arbitrary scene graph transforms as the source of truth.

## Fixed-step loop

```js
let accumulator = 0;
let lastReal = performance.now();

function frame(now) {
  const realDt = Math.min((now - lastReal) / 1000, 0.1);
  lastReal = now;
  accumulator += realDt;

  let steps = 0;
  while (accumulator >= FIXED_DT && steps < MAX_STEPS) {
    updateFixed(FIXED_DT);
    accumulator -= FIXED_DT;
    steps += 1;
  }

  render(accumulator / FIXED_DT, realDt);
  requestAnimationFrame(frame);
}
```

FPS telemetry must use real time, not `FIXED_DT` or a clamped render delta.

## State model sketch

```js
const state = {
  mode: 'title',
  chamberId: 1,
  loop: {
    time: 0,
    duration: 20,
    index: 0,
    rewinding: false,
  },
  player: {
    x: 0,
    z: 5,
    yaw: 0,
    vx: 0,
    vz: 0,
    actDown: false,
    alive: true,
  },
  echoes: [],
  mechanisms: new Map(),
  objective: {
    jewelTaken: false,
    escaped: false,
  },
  score: {
    elapsedMs: 0,
    rewinds: 0,
    hits: 0,
    shard: false,
  },
};
```

## Actor interface

The player and echoes share a minimal actor interface:

```js
{
  id,
  kind: 'player' | 'echo',
  position: { x, z },
  yaw,
  capabilities: {
    presence: true,
    holdInteraction: true,
    objectivePickup: kind === 'player',
    exit: kind === 'player',
  }
}
```

Mechanisms evaluate actors by capability instead of hard-coding only the player.

## Reset registry

Every stateful chamber object registers a reset adapter:

```js
resetRegistry.register({
  id: 'crank-inner',
  capture() { return { progress: crank.progress }; },
  restore(snapshot) { crank.progress = snapshot.progress; },
});
```

Capture once after chamber construction. On rewind, restore all baseline snapshots and reset view animation velocities.

## Asset manifest

Keep selected production assets explicit:

```js
export const ASSETS = {
  thief: () => import('./thief.js'),
  pressurePlate: () => import('./pressure-plate.js'),
  vaultDoor: () => import('./vault-door.js'),
};
```

Do not scan arbitrary directories at runtime. Explicit imports make shipping and missing-file failures obvious.

## Collision

Use simple analytic collision separate from visual geometry:

- player circle against axis-aligned or oriented boxes,
- simple segment/circle gates,
- trigger circles for plates/interactions,
- hazard capsules or swept angular sectors.

Do not derive collision from detailed generated meshes. It is slow and unpredictable.

## Chamber data

Keep chamber configuration mostly declarative:

```js
{
  id: 1,
  spawn: [0, 5],
  duration: 20,
  mechanisms: [
    { type: 'plate', id: 'plate-a', position: [-3, 2.8] },
    { type: 'door', id: 'door-a', position: [0, 0.7], inputs: ['plate-a'] },
  ],
  objective: { type: 'pickup', id: 'key', position: [0, -3.8] }
}
```

This lets the same tested mechanism code power all three chambers.

## Loading and readiness

`window.__READY__` becomes true only when:

- Three.js is loaded,
- renderer is created,
- required asset modules are imported,
- active chamber is built,
- start button is usable,
- no fatal load error exists.

Do not set ready after only the HTML shell loads.

## Public telemetry

Refresh each rendered frame:

```js
window.__GAME__ = {
  pos: [state.player.x, state.player.z],
  fps,
  speed: Math.hypot(state.player.vx, state.player.vz),
  score: computeScore(state),
  over: state.mode === 'final-result',
  draws: renderer.info.render.calls,
  tris: renderer.info.render.triangles,

  started: hasStarted,
  chamber: state.chamberId,
  loopTime: state.loop.time,
  echoCount: state.echoes.length,
  rewindCount: state.score.rewinds,
  plateActive: Boolean(mechanisms.get('plate-a')?.active),
  vaultOpen: Boolean(mechanisms.get('door-a')?.openAmount > 0.9),
  jewelTaken: state.objective.jewelTaken,
  escaped: state.objective.escaped,
  objectiveProgress: computeObjectiveProgress(state),
  playerBox: getPlayerScreenBox(),
  targets: debugGateTargets,
};
```

The custom gate may read telemetry to know whether real inputs caused real gameplay. It must still press controls through real browser events.

## Build and dependency strategy

The starter uses npm only to obtain Three.js and optional dev tooling. A setup script copies the pinned Three.js module into `game/vendor/`. The shipped folder then works without npm or a CDN.

Pin the Three.js version. Do not silently upgrade during the jam.

## Deployment

Preferred: GitHub Pages from the exact `game/` folder or a deployment output that preserves local paths. Run the organizer ship tool, stamp imports if required, deploy, then test the real URL.

Static host risks:

- case-sensitive filenames,
- stale cached modules,
- paths that worked only from the development parent directory,
- CDN dependency failure,
- service-worker cache from an old build.

Use the organizer’s current `ship.mjs` and `live.mjs` flow.

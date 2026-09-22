import * as THREE from './vendor/three.module.js';
import { CONFIG } from './config.js';
import { FixedStepClock } from './core/fixed-step.js';
import { createGameState } from './core/game-state.js';
import { createTelemetry, FpsMeter } from './core/telemetry.js';
import { InputManager } from './input/input-manager.js';
import { bindTouchControls } from './input/touch-controls.js';
import { createChamber01 } from './levels/chamber-01.js';
import { movePlayer } from './systems/movement.js';

// Milestone 01: the existing recorder/replay/audio modules are deliberately not imported.
const telemetry = createTelemetry();
const state = createGameState();
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#game-canvas'), antialias: true, alpha: false });
renderer.setClearColor(0x07090e, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-6.4, 6.4, 10, -10, .1, 80);
// Fixed 40-degree view. Screen-up is world -Z; neither input nor movement rotates the camera.
camera.position.set(0, 11, 13);
camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight(0x8fa6b8, 0x17120e, 2.0));
const key = new THREE.DirectionalLight(0xffdfa0, 3);
key.position.set(-3, 8, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
scene.add(key);
const cool = new THREE.PointLight(0x72c8e8, 24, 18, 2);
cool.position.set(3.8, 3.8, -3.5); scene.add(cool);
const chamber = createChamber01(scene);
const input = new InputManager();
const touch = bindTouchControls(input);
const clock = new FixedStepClock({ hz: CONFIG.fixedHz, maxSteps: 5 });
const fps = new FpsMeter();
const app = document.querySelector('#app');
const title = document.querySelector('#title-screen');
const act = document.querySelector('#act-button');
const rewind = document.querySelector('#rewind-button');
const status = document.querySelector('#control-status');
const hint = document.querySelector('#keyboard-hint');
let suspended = document.hidden;
telemetry.camera = { position: camera.position.toArray(), rotation: camera.quaternion.toArray() };
let lastStatus = '';
function resize() {
  const width = window.innerWidth, height = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2));
  renderer.setSize(width, height, false);
  const aspect = width / height;
  const halfHeight = Math.max(6.4 / aspect, 6.2);
  camera.top = halfHeight; camera.bottom = -halfHeight;
  camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize, { passive: true });
resize();
function startGame() {
  if (!window.__READY__ || telemetry.started) return;
  telemetry.started = true;
  state.mode = 'playing'; app.dataset.mode = 'playing'; title.hidden = true;
  input.clear(); touch.setEnabled(!suspended); clock.reset();
}
function suspend() {
  suspended = true; input.clear(); touch.setEnabled(false); clock.reset();
  state.player.vx = state.player.vz = 0;
  if (telemetry.started) { state.mode = 'paused'; app.dataset.mode = 'paused'; }
}
function resume() {
  if (document.hidden) return;
  suspended = false; clock.reset();
  if (telemetry.started) { state.mode = 'playing'; app.dataset.mode = 'playing'; touch.setEnabled(true); }
}
window.addEventListener('blur', suspend);
window.addEventListener('focus', resume);
document.addEventListener('visibilitychange', () => document.hidden ? suspend() : resume());
function updateFixed(dt) {
  if (state.mode !== 'playing' || suspended) return;
  state.totalTime += dt;
  movePlayer(state.player, input.movement(), dt);
}
function render(now) {
  const timing = clock.tick(now, updateFixed);
  chamber.update(state, 0);
  act.classList.toggle('is-pressed', input.act);
  rewind.classList.toggle('is-pressed', input.rewind);
  hint.classList.toggle('act-held', input.act);
  hint.classList.toggle('rewind-held', input.rewind);
  const message = suspended ? 'PAUSED · RETURN TO PLAY' : input.rewind ? 'REWIND · PREVIEW ONLY' : input.act ? 'ACT · PREVIEW ONLY' : 'MOVE AROUND THE TEST ROOM';
  if (message !== lastStatus) { status.textContent = message; lastStatus = message; }
  if (!document.hidden) renderer.render(scene, camera);
  telemetry.ready = window.__READY__;
  telemetry.mode = state.mode;
  telemetry.pos[0] = state.player.x; telemetry.pos[1] = state.player.z;
  telemetry.fps = fps.push(timing.realDt);
  telemetry.speed = Math.hypot(state.player.vx, state.player.vz);
  telemetry.draws = renderer.info.render.calls; telemetry.tris = renderer.info.render.triangles;
  // Loop/score/puzzle fields remain at zero/false until their systems exist.
  telemetry.elapsedTime = state.totalTime;
  telemetry.actDown = input.act; telemetry.rewindDown = input.rewind;
  telemetry.inputX = input.movement().x; telemetry.inputY = input.movement().y;
  telemetry.yaw = state.player.yaw;
  requestAnimationFrame(render);
}
document.querySelector('#start-button').addEventListener('click', startGame);
window.__START__ = startGame;
touch.setEnabled(false);
chamber.update(state, 0);
renderer.render(scene, camera);
window.__READY__ = true;
telemetry.ready = true;
telemetry.readyMs = performance.now();
document.querySelector('#start-button').disabled = false;
requestAnimationFrame(render);

import test from 'node:test';
import assert from 'node:assert/strict';
import { FixedStepClock } from '../game/core/fixed-step.js';
import { FpsMeter } from '../game/core/telemetry.js';
import { normalize2 } from '../game/core/math.js';
import { InputManager } from '../game/input/input-manager.js';
import { joystickVector } from '../game/input/touch-controls.js';
import { constrainRoom, resolveBox, movePlayer } from '../game/systems/movement.js';
import { CONFIG } from '../game/config.js';

test('fixed simulation agrees at 30, 60, and 120 render Hz', () => {
  for (const hz of [30, 60, 120]) {
    const clock = new FixedStepClock();
    let steps = 0;
    for (let i = 0; i <= hz * 10; i++) clock.tick(i * 1000 / hz, () => steps++);
    assert.equal(steps, 600);
  }
});
test('long frames limit catch-up to five steps but report actual elapsed time', () => {
  const clock = new FixedStepClock(); clock.tick(0, () => {});
  const value = clock.tick(5000, () => {});
  assert.equal(value.steps, 5); assert.equal(value.realDt, 5);
  assert.ok(value.alpha >= 0 && value.alpha < 1);
});
test('clock reset discards hidden time', () => {
  const clock = new FixedStepClock(); clock.tick(0, () => {}); clock.reset();
  assert.equal(clock.tick(100000, () => assert.fail('background catch-up')).steps, 0);
});
test('FPS does not turn a five-second frame into healthy performance', () => {
  const fps = new FpsMeter(); fps.push(0);
  assert.equal(fps.push(5), .2);
});
test('normalization preserves analogue magnitude and caps diagonals', () => {
  assert.equal(Math.hypot(normalize2(1,1).x, normalize2(1,1).y), 1);
  assert.equal(normalize2(.3, .4).x, .3);
  assert.deepEqual(normalize2(0,0), { x:0, y:0, length:0 });
});
test('joystick dead zone, analogue response and extreme drags', () => {
  assert.deepEqual(joystickVector(2,2,40), { x:0, y:0 });
  const half = joystickVector(20,0,40); assert.ok(half.x > .4 && half.x < .5);
  const far = joystickVector(1000,-1000,40); assert.ok(Math.hypot(far.x,far.y) <= 1);
});
function fixture() {
  const target = new EventTarget(), visibility = new EventTarget();
  const input = new InputManager(target, visibility); input.setEnabled(true);
  const key = (type, value, repeat = false) => {
    const event = new Event(type, { cancelable:true });
    Object.assign(event, { key:value, repeat }); target.dispatchEvent(event);
  };
  return { target, visibility, input, key };
}
test('joystick returns to zero on clear, blur, and visibility loss', () => {
  const { target, visibility, input } = fixture();
  for (const reset of [() => input.clear(), () => target.dispatchEvent(new Event('blur')), () => { visibility.hidden = true; visibility.dispatchEvent(new Event('visibilitychange')); }]) {
    input.beginJoystick(); input.setJoystick(1,0); input.pointerAct = true;
    reset(); assert.equal(input.movement().x,0); assert.equal(input.act,false);
  }
  input.destroy();
});
test('switching devices never leaves the previous direction active', () => {
  const { input, key } = fixture();
  key('keydown','w'); input.beginJoystick(); input.setJoystick(1,0);
  key('keydown','w',true); assert.equal(input.movement().x,1);
  input.setJoystick(0,0); assert.equal(input.movement().y,0);
  key('keyup','w'); key('keydown','a'); assert.equal(input.movement().x,-1);
  key('keyup','a'); assert.equal(input.movement().x,0); input.destroy();
});
test('overlapping keyboard and touch actions release independently', () => {
  const { input, key } = fixture();
  key('keydown','e'); key('keydown',' '); key('keyup','e'); assert.equal(input.act,true);
  input.pointerAct = true; key('keyup',' '); assert.equal(input.act,true);
  input.pointerAct = false; assert.equal(input.act,false);
  input.setEnabled(false); key('keydown','r'); assert.equal(input.rewind,false); input.destroy();
});
test('room contains the entire actor circle at every angle', () => {
  for (let i = 0; i < 360; i++) {
    const p = constrainRoom({ x: 10*Math.cos(i), z:10*Math.sin(i) }, 6, .28);
    assert.ok(Math.hypot(p.x,p.z) <= 5.72 + 1e-12);
  }
});
test('circle-box resolution handles faces, corners, and embedded centres', () => {
  const box = { minX:-1, maxX:1, minZ:-1, maxZ:1 };
  const p = resolveBox({x:0,z:1.1},box,.28); assert.equal(p.z,1.28);
  const corner = resolveBox({x:1.1,z:1.1},box,.28);
  assert.ok(Math.abs(Math.hypot(corner.x-1,corner.z-1)-.28)<1e-12);
  const centre = resolveBox({x:0,z:0},box,.28);
  assert.ok(Math.abs(centre.x) >= 1.28 || Math.abs(centre.z) >= 1.28);
});
test('sustained movement cannot cross closed gate or room edge', () => {
  const p = {...CONFIG.spawn};
  for (let i = 0; i < 600; i++) movePlayer(p, {x:0,y:-1},1/60);
  assert.ok(p.z >= CONFIG.gate.z+.23+CONFIG.playerRadius-1e-9);
  for (let i = 0; i < 600; i++) movePlayer(p, {x:1,y:0},1/60);
  assert.ok(Math.hypot(p.x,p.z) <= 5.72+1e-12);
});

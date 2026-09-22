import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoom, resolveClosedGate } from '../game/core/collision.js';

test('room collision clamps to radius', () => {
  const p = resolveRoom({ x: 10, z: 0 }, 5);
  assert.equal(p.x, 5);
  assert.equal(p.z, 0);
});

test('closed gate blocks crossing and open gate permits it', () => {
  const gate = { x: 0, z: .5, halfWidth: 1, thickness: .2 };
  const before = { x: 0, z: 1 };
  const desired = { x: 0, z: 0 };
  assert.ok(resolveClosedGate(before, desired, gate, .25, 0).z > .5);
  assert.equal(resolveClosedGate(before, desired, gate, .25, 1).z, 0);
});

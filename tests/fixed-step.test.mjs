import test from 'node:test';
import assert from 'node:assert/strict';
import { FixedStepClock } from '../game/core/fixed-step.js';

test('fixed clock advances in stable steps', () => {
  const clock = new FixedStepClock({ hz: 60 });
  let count = 0;
  clock.tick(0, () => count++);
  const result = clock.tick(1000 / 30, () => count++);
  assert.equal(result.steps, 2);
  assert.equal(count, 2);
});

test('fixed clock clamps pathological frame delta', () => {
  const clock = new FixedStepClock({ hz: 60, maxFrameDelta: .1, maxSteps: 8 });
  clock.tick(0, () => {});
  const result = clock.tick(5000, () => {});
  assert.ok(result.steps <= 8);
});

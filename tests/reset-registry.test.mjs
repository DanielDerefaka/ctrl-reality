import test from 'node:test';
import assert from 'node:assert/strict';
import { ResetRegistry } from '../game/core/reset-registry.js';

test('reset registry restores immutable baseline copy', () => {
  const object = { value: 2, nested: { open: false } };
  const registry = new ResetRegistry();
  registry.register({ id: 'x', capture: () => object, restore: (snapshot) => Object.assign(object, snapshot) });
  registry.captureBaseline();
  object.value = 9; object.nested.open = true;
  registry.restoreBaseline();
  assert.equal(object.value, 2);
  assert.equal(object.nested.open, false);
});

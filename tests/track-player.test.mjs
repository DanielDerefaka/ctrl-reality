import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleTrack, eventsBetween } from '../game/core/track-player.js';

const track = {
  frames: [{ t: 0, x: 0, z: 0, yaw: 0 }, { t: 1, x: 2, z: -2, yaw: Math.PI }],
  events: [{ t: .2, type: 'a' }, { t: .8, type: 'b' }],
};

test('track interpolation is deterministic', () => {
  const sample = sampleTrack(track, .5);
  assert.equal(sample.x, 1);
  assert.equal(sample.z, -1);
  assert.ok(Math.abs(sample.yaw - Math.PI / 2) < 1e-8);
});

test('track holds final pose', () => {
  const sample = sampleTrack(track, 99);
  assert.equal(sample.x, 2);
  assert.equal(sample.z, -2);
});

test('events are emitted once for a time interval', () => {
  assert.deepEqual(eventsBetween(track, .1, .5).map(e => e.type), ['a']);
  assert.deepEqual(eventsBetween(track, .5, 1).map(e => e.type), ['b']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { TrackRecorder } from '../game/core/track-recorder.js';

function actor(x = 0, z = 0, yaw = 0) { return { x, z, yaw }; }

test('recorder captures at requested cadence', () => {
  const recorder = new TrackRecorder({ sampleHz: 30 });
  for (let i = 0; i <= 60; i++) recorder.capture(i / 60, actor(i / 60, 0));
  const track = recorder.finalize(1, actor(1, 0));
  assert.ok(track.frames.length >= 30 && track.frames.length <= 32);
  assert.equal(track.frames[0].t, 0);
});

test('recorder tracks final held interaction', () => {
  const recorder = new TrackRecorder();
  recorder.capture(0, actor());
  recorder.event(.2, 'interaction-start', 'crank-a');
  const track = recorder.finalize(1, actor(1, 0));
  assert.equal(track.finalHeldTarget, 'crank-a');
});

test('meaningful movement rejects empty accidental rewind', () => {
  const recorder = new TrackRecorder({ meaningfulDistance: .2 });
  recorder.capture(0, actor());
  assert.equal(recorder.hasMeaningfulInput(actor(.1, 0)), false);
  assert.equal(recorder.hasMeaningfulInput(actor(.3, 0)), true);
});

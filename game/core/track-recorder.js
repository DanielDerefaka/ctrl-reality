function cloneFrame(time, actor) {
  return { t: time, x: actor.x, z: actor.z, yaw: actor.yaw };
}

export class TrackRecorder {
  constructor({ sampleHz = 30, meaningfulDistance = 0.12 } = {}) {
    this.sampleInterval = 1 / sampleHz;
    this.meaningfulDistance = meaningfulDistance;
    this.reset();
  }

  reset() {
    this.frames = [];
    this.events = [];
    this.nextSampleTime = 0;
    this.start = null;
    this.finalHeldTarget = null;
  }

  capture(time, actor) {
    if (!Number.isFinite(time)) throw new TypeError('time must be finite');
    if (!this.start) this.start = { x: actor.x, z: actor.z };
    while (time + 1e-8 >= this.nextSampleTime) {
      this.frames.push(cloneFrame(this.nextSampleTime, actor));
      this.nextSampleTime += this.sampleInterval;
    }
  }

  event(time, type, targetId = null, payload = null) {
    this.events.push({ t: time, type, targetId, payload });
    if (type === 'interaction-start') this.finalHeldTarget = targetId;
    if (type === 'interaction-end' && this.finalHeldTarget === targetId) this.finalHeldTarget = null;
  }

  hasMeaningfulInput(actor) {
    if (!this.start) return false;
    return Math.hypot(actor.x - this.start.x, actor.z - this.start.z) >= this.meaningfulDistance || this.events.length > 0;
  }

  finalize(duration, actor) {
    this.capture(duration, actor);
    const track = Object.freeze({
      duration,
      frames: Object.freeze(this.frames.map(Object.freeze)),
      events: Object.freeze([...this.events].sort((a, b) => a.t - b.t).map(Object.freeze)),
      finalHeldTarget: this.finalHeldTarget,
    });
    this.reset();
    return track;
  }
}

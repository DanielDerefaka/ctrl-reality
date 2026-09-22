export class FixedStepClock {
  constructor({ hz = 60, maxFrameDelta = 0.1, maxSteps = 5 } = {}) {
    if (!Number.isFinite(hz) || hz <= 0) throw new TypeError('hz must be positive');
    this.dt = 1 / hz;
    this.maxFrameDelta = maxFrameDelta;
    this.maxSteps = maxSteps;
    this.accumulator = 0;
    this.lastMs = null;
  }

  reset(nowMs = null) {
    this.accumulator = 0;
    this.lastMs = nowMs;
  }

  tick(nowMs, step) {
    if (this.lastMs === null) {
      this.lastMs = nowMs;
      return { steps: 0, alpha: 0, realDt: 0 };
    }
    const realDt = Math.max((nowMs - this.lastMs) / 1000, 0);
    this.lastMs = nowMs;
    this.accumulator += Math.min(realDt, this.maxFrameDelta);
    let steps = 0;
    while (this.accumulator + 1e-12 >= this.dt && steps < this.maxSteps) {
      step(this.dt);
      this.accumulator = Math.max(0, this.accumulator - this.dt);
      steps += 1;
    }
    if (steps === this.maxSteps && this.accumulator >= this.dt) {
      this.accumulator %= this.dt;
    }
    return { steps, alpha: this.accumulator / this.dt, realDt };
  }
}

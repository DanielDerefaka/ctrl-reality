export function createTelemetry() {
  const game = {
    ready: false,
    started: false,
    mode: 'boot',
    pos: [0, 0],
    fps: 0,
    speed: 0,
    score: 0,
    over: false,
    draws: 0,
    tris: 0,
    chamber: 1,
    loopTime: 0,
    echoCount: 0,
    plateActive: false,
    vaultOpen: false,
    jewelTaken: false,
  };
  window.__GAME__ = game;
  return game;
}

export class FpsMeter {
  constructor(windowSeconds = 0.75) {
    this.windowSeconds = windowSeconds;
    this.elapsed = 0;
    this.frames = 0;
    this.value = 0;
  }
  push(realDt) {
    if (realDt <= 0) return this.value;
    this.elapsed += realDt;
    this.frames += 1;
    if (this.elapsed >= this.windowSeconds) {
      this.value = this.frames / this.elapsed;
      this.elapsed = 0;
      this.frames = 0;
    }
    return this.value;
  }
}

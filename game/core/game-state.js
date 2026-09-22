import { CONFIG } from '../config.js';

export function createGameState() {
  return {
    mode: 'title',
    chamber: 1,
    loopTime: 0,
    totalTime: 0,
    rewinds: 0,
    rewindElapsed: 0,
    player: { ...CONFIG.spawn, vx: 0, vz: 0 },
    echoes: [],
    plateActive: false,
    doorOpen: 0,
    jewelTaken: false,
    complete: false,
    nearJewel: false,
    actDown: false,
    elapsedBeforeComplete: 0,
  };
}

export function resetCurrentRun(state) {
  Object.assign(state.player, CONFIG.spawn, { vx: 0, vz: 0 });
  state.loopTime = 0;
  state.plateActive = false;
  state.doorOpen = 0;
  state.nearJewel = false;
  state.actDown = false;
}

import { clampToCircle } from './math.js';

export function resolveRoom(position, roomRadius) {
  return clampToCircle(position, roomRadius);
}

export function resolveClosedGate(previous, next, gate, radius = 0.28, openAmount = 0) {
  if (openAmount >= 0.8) return next;
  const halfWidth = gate.halfWidth + radius;
  if (Math.abs(next.x - gate.x) > halfWidth) return next;
  const line = gate.z;
  const crossedForward = previous.z > line && next.z <= line;
  const crossedBackward = previous.z < line && next.z >= line;
  const nearBand = Math.abs(next.z - line) < gate.thickness + radius;
  if (!crossedForward && !crossedBackward && !nearBand) return next;
  return { ...next, z: previous.z > line ? line + gate.thickness + radius : line - gate.thickness - radius };
}

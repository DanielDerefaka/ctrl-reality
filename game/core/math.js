export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;

export function normalize2(x, y, out = {}) {
  const length = Math.hypot(x, y);
  const scale = length > 1 ? 1 / length : 1;
  out.x = length > 1e-8 ? x * scale : 0;
  out.y = length > 1e-8 ? y * scale : 0;
  out.length = length;
  return out;
}

export function shortestAngleDelta(a, b) {
  let delta = (b - a) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function lerpAngle(a, b, t) {
  return a + shortestAngleDelta(a, b) * t;
}

export function clampToCircle(position, radius) {
  const length = Math.hypot(position.x, position.z);
  if (length <= radius || length <= 1e-8) return { ...position };
  const scale = radius / length;
  return { ...position, x: position.x * scale, z: position.z * scale };
}

export function distanceSquared2D(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

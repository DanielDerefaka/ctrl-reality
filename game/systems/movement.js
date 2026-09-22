import { CONFIG } from '../config.js';
import { shortestAngleDelta } from '../core/math.js';

// The boundary constrains the whole actor circle, not just its centre.
export function constrainRoom(player, roomRadius, actorRadius = 0) {
  const limit = Math.max(0, roomRadius - actorRadius);
  const distance = Math.hypot(player.x, player.z);
  if (distance > limit) { player.x *= limit / distance; player.z *= limit / distance; }
  return player;
}

// Circle against a static AABB, including an embedded-centre recovery case.
export function resolveBox(player, box, radius) {
  const nx = Math.max(box.minX, Math.min(box.maxX, player.x));
  const nz = Math.max(box.minZ, Math.min(box.maxZ, player.z));
  const dx = player.x - nx, dz = player.z - nz;
  const distance = Math.hypot(dx, dz);
  if (distance >= radius) return player;
  if (distance > 1e-8) {
    player.x += dx / distance * (radius - distance);
    player.z += dz / distance * (radius - distance);
  } else {
    const left = player.x - box.minX, right = box.maxX - player.x;
    const front = box.maxZ - player.z, back = player.z - box.minZ;
    const nearest = Math.min(left, right, front, back);
    if (nearest === left) player.x = box.minX - radius;
    else if (nearest === right) player.x = box.maxX + radius;
    else if (nearest === front) player.z = box.maxZ + radius;
    else player.z = box.minZ - radius;
  }
  return player;
}

export const FLOOR_BLOCKERS = Object.freeze([
  { minX: -1.42, maxX: 1.42, minZ: CONFIG.gate.z - .23, maxZ: CONFIG.gate.z + .23 },
  { minX: -.7, maxX: .7, minZ: CONFIG.jewel.z - .7, maxZ: CONFIG.jewel.z + .7 },
]);
export function movePlayer(player, movement, dt) {
  const x = player.x, z = player.z;
  player.x += movement.x * CONFIG.playerSpeed * dt;
  player.z += movement.y * CONFIG.playerSpeed * dt;
  for (const box of FLOOR_BLOCKERS) resolveBox(player, box, CONFIG.playerRadius);
  constrainRoom(player, CONFIG.roomRadius, CONFIG.playerRadius);
  player.vx = (player.x - x) / dt; player.vz = (player.z - z) / dt;
  if (Math.hypot(movement.x, movement.y) > .01) {
    player.yaw += shortestAngleDelta(player.yaw, Math.atan2(movement.x, movement.y)) * (1 - Math.exp(-dt * 15));
  }
}

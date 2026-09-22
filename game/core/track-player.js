import { clamp, lerp, lerpAngle } from './math.js';

export function sampleTrack(track, time) {
  const frames = track?.frames ?? [];
  if (frames.length === 0) return null;
  if (time <= frames[0].t) return { ...frames[0] };
  const last = frames[frames.length - 1];
  if (time >= last.t) return { ...last };

  let low = 0;
  let high = frames.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (frames[mid].t <= time) low = mid;
    else high = mid;
  }
  const a = frames[low];
  const b = frames[high];
  const span = Math.max(b.t - a.t, 1e-8);
  const t = clamp((time - a.t) / span, 0, 1);
  return { t: time, x: lerp(a.x, b.x, t), z: lerp(a.z, b.z, t), yaw: lerpAngle(a.yaw, b.yaw, t) };
}

export function eventsBetween(track, previousTime, currentTime) {
  if (!track?.events?.length || currentTime < previousTime) return [];
  return track.events.filter((event) => event.t > previousTime && event.t <= currentTime);
}

// Radial dead zone preserves analogue travel; the output never exceeds unit length.
export function joystickVector(dx, dy, radius, out = {}) {
  const length = Math.hypot(dx, dy);
  const amount = Math.min(1, Math.max(0, (length / radius - .12) / .88));
  out.x = length ? dx / length * amount : 0;
  out.y = length ? dy / length * amount : 0;
  return out;
}

export function bindTouchControls(input) {
  const zone = document.querySelector('#joystick-zone');
  const base = zone.querySelector('.joystick-base');
  const knob = document.querySelector('#joystick-knob');
  const act = document.querySelector('#act-button');
  const rewind = document.querySelector('#rewind-button');
  let pointerId = null, enabled = false;
  const vector = {};
  const held = new Map();
  function releaseJoystick(event) {
    if (event && event.pointerId !== pointerId) return;
    const old = pointerId;
    pointerId = null;
    if (old !== null && zone.hasPointerCapture(old)) zone.releasePointerCapture(old);
    input.setJoystick(0, 0);
    knob.style.transform = 'translate(-50%, -50%)';
  }
  function updateJoystick(event) {
    const rect = base.getBoundingClientRect();
    const max = rect.width * .36;
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    joystickVector(dx, dy, max, vector);
    input.setJoystick(vector.x, vector.y);
    knob.style.transform = `translate(calc(-50% + ${vector.x * max}px), calc(-50% + ${vector.y * max}px))`;
  }
  zone.addEventListener('pointerdown', (event) => {
    if (!enabled || pointerId !== null || event.button !== 0) return;
    event.preventDefault();
    pointerId = event.pointerId;
    input.beginJoystick();
    zone.setPointerCapture(pointerId);
    updateJoystick(event);
  });
  zone.addEventListener('pointermove', (event) => { if (event.pointerId === pointerId) updateJoystick(event); });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(type, releaseJoystick);
  function releaseButton(button, field, event) {
    const id = held.get(button);
    if (event && event.pointerId !== id) return;
    held.delete(button);
    if (id !== undefined && button.hasPointerCapture(id)) button.releasePointerCapture(id);
    input[field] = false;
    button.classList.remove('is-pressed');
  }
  for (const [button, field] of [[act, 'pointerAct'], [rewind, 'pointerRewind']]) {
    button.addEventListener('pointerdown', (event) => {
      if (!enabled || held.has(button) || event.button !== 0) return;
      event.preventDefault();
      held.set(button, event.pointerId);
      button.setPointerCapture(event.pointerId);
      input[field] = true;
      button.classList.add('is-pressed');
    });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) {
      button.addEventListener(type, event => releaseButton(button, field, event));
    }
  }
  input.onKeyboardMovement = () => releaseJoystick();
  input.onClear = () => {
    releaseJoystick();
    releaseButton(act, 'pointerAct'); releaseButton(rewind, 'pointerRewind');
  };
  return {
    setEnabled(value) {
      enabled = value;
      zone.style.pointerEvents = value ? 'auto' : 'none';
      act.disabled = rewind.disabled = !value;
      input.setEnabled(value);
    },
  };
}

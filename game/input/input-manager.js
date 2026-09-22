import { normalize2 } from '../core/math.js';
const movementKeys = new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
const actionKeys = new Set(['e',' ','r']);

export class InputManager {
  constructor(target = window, visibility = document) {
    this.keys = new Set();
    this.joystick = { x: 0, y: 0 };
    this.vector = { x: 0, y: 0, length: 0 };
    this.pointerAct = false;
    this.pointerRewind = false;
    this.enabled = false;
    this.source = 'keyboard';
    this.onClear = () => {};
    this.onKeyboardMovement = () => {};
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    target.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (!this.enabled || (!movementKeys.has(key) && !actionKeys.has(key))) return;
      event.preventDefault();
      if (movementKeys.has(key)) {
        // A fresh device takes movement ownership; a held old key cannot reassert it.
        if (event.repeat && this.source !== 'keyboard') return;
        this.source = 'keyboard';
        this.onKeyboardMovement();
        this.setJoystick(0, 0);
      }
      this.keys.add(key);
    }, { signal });
    target.addEventListener('keyup', (event) => this.keys.delete(event.key.toLowerCase()), { signal });
    target.addEventListener('blur', () => this.clear(), { signal });
    visibility.addEventListener('visibilitychange', () => { if (visibility.hidden) this.clear(); }, { signal });
  }
  get act() { return this.pointerAct || this.keys.has('e') || this.keys.has(' '); }
  get rewind() { return this.pointerRewind || this.keys.has('r'); }
  beginJoystick() {
    for (const key of movementKeys) this.keys.delete(key);
    this.source = 'touch';
  }
  movement() {
    let x = this.joystick.x, y = this.joystick.y;
    if (this.source === 'keyboard') {
      x = Number(this.keys.has('d') || this.keys.has('arrowright')) - Number(this.keys.has('a') || this.keys.has('arrowleft'));
      y = Number(this.keys.has('s') || this.keys.has('arrowdown')) - Number(this.keys.has('w') || this.keys.has('arrowup'));
    }
    return normalize2(x, y, this.vector);
  }
  setJoystick(x, y) { normalize2(x, y, this.joystick); }
  setEnabled(enabled) { this.enabled = enabled; if (!enabled) this.clear(); }
  clear() {
    this.keys.clear(); this.setJoystick(0, 0);
    this.pointerAct = false; this.pointerRewind = false;
    this.onClear();
  }
  destroy() { this.clear(); this.abortController.abort(); }
}

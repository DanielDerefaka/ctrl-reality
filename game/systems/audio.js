export class PrototypeAudio {
  constructor() { this.context = null; }
  async unlock() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
  }
  tone({ frequency = 440, duration = .08, gain = .03, type = 'sine' } = {}) {
    if (!this.context || this.context.state !== 'running') return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, now);
    envelope.gain.setValueAtTime(.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + .008);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(envelope).connect(this.context.destination);
    oscillator.start(now); oscillator.stop(now + duration + .02);
  }
  plate(active) { this.tone({ frequency: active ? 170 : 120, duration: .1, gain: .04, type: 'square' }); }
  rewind() { this.tone({ frequency: 260, duration: .42, gain: .045, type: 'sawtooth' }); }
  jewel() { this.tone({ frequency: 880, duration: .5, gain: .045, type: 'sine' }); }
}

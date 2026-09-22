export class ResetRegistry {
  constructor() {
    this.entries = new Map();
    this.baseline = new Map();
  }

  register(entry) {
    if (!entry?.id || typeof entry.capture !== 'function' || typeof entry.restore !== 'function') {
      throw new TypeError('reset entry requires id, capture, and restore');
    }
    if (this.entries.has(entry.id)) throw new Error(`duplicate reset id: ${entry.id}`);
    this.entries.set(entry.id, entry);
    return () => {
      this.entries.delete(entry.id);
      this.baseline.delete(entry.id);
    };
  }

  captureBaseline() {
    this.baseline.clear();
    for (const [id, entry] of this.entries) this.baseline.set(id, structuredClone(entry.capture()));
  }

  restoreBaseline() {
    for (const [id, snapshot] of this.baseline) {
      const entry = this.entries.get(id);
      if (entry) entry.restore(structuredClone(snapshot));
    }
  }
}

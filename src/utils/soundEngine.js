/**
 * soundEngine.js  -  Vice City Heist Web Audio Synthesizer
 * Built entirely with Web Audio API for zero-latency, authentic retro synth sounds.
 */

class SoundEngine {
  static _ctx = null;
  static _masterGain = null;
  static _muted = false;
  static _droneOsc = null;
  static _droneGain = null;

  static init() {
    if (this._ctx) {
      if (this._ctx.state === 'suspended') this._ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this._ctx = new AudioCtx();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.setValueAtTime(0.55, this._ctx.currentTime);
    this._masterGain.connect(this._ctx.destination);
  }

  static resume() {
    this.init();
    if (this._ctx?.state === 'suspended') this._ctx.resume();
  }

  static mute(v) {
    this._muted = v;
    if (this._masterGain && this._ctx) {
      this._masterGain.gain.setValueAtTime(v ? 0 : 0.55, this._ctx.currentTime);
    }
  }

  static get isMuted() { return this._muted; }

  static _osc(type, freq, startTime, endTime, gainPeak = 0.3) {
    if (this._muted || !this._ctx) return;
    const ctx = this._ctx;
    const g = ctx.createGain();
    g.connect(this._masterGain);
    g.gain.setValueAtTime(0.001, startTime);
    g.gain.linearRampToValueAtTime(gainPeak, startTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, endTime);
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.connect(g);
    osc.start(startTime);
    osc.stop(endTime + 0.05);
  }

  static _noise(duration, startTime, gainPeak = 0.15) {
    if (this._muted || !this._ctx) return;
    const ctx = this._ctx;
    const bufSize = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, startTime);
    filter.Q.setValueAtTime(0.5, startTime);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gainPeak, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(this._masterGain);
    src.start(startTime);
    src.stop(startTime + duration);
  }

  /* ── Game SFX matching previous model ── */
  static playClick() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('square', 880, t, t + 0.05, 0.14);
  }

  static playKeyType() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    const freqs = [1200, 1400, 1100, 1300];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this._osc('triangle', f, t, t + 0.03, 0.04);
  }

  static playRuleClear() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('sine', 587.33, t, t + 0.11, 0.15);
    this._osc('sine', 880.00, t + 0.07, t + 0.22, 0.18);
  }

  static playHintUsed() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 330.00, t, t + 0.12, 0.16);
    this._osc('triangle', 261.63, t + 0.08, t + 0.24, 0.15);
  }

  static playTick() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 480, t, t + 0.05, 0.09);
  }

  static playAlert() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    for (let i = 0; i < 3; i++) {
      this._osc('square', 1760, t + i * 0.16, t + i * 0.16 + 0.10, 0.22);
      this._osc('square', 880, t + i * 0.16 + 0.05, t + i * 0.16 + 0.15, 0.14);
    }
  }

  static playSuccess() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this._osc('sine', f, t + i * 0.09, t + i * 0.09 + 0.2, 0.16);
    });
  }

  static playGameOver() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    [370.00, 330.00, 277.18, 185.00].forEach((f, i) => {
      this._osc('sawtooth', f, t + i * 0.12, t + i * 0.12 + 0.28, 0.18);
    });
    this._noise(0.6, t + 0.3, 0.15);
  }

  static playFreeze() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('sawtooth', 220, t, t + 0.8, 0.3);
    this._osc('sawtooth', 110, t + 0.1, t + 0.9, 0.2);
    this._noise(0.5, t, 0.08);
  }

  static playUnlock() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    [392, 523, 659].forEach((f, i) => {
      this._osc('triangle', f, t + i * 0.08, t + i * 0.08 + 0.2, 0.28);
    });
  }

  static playRadioChirp() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('sine', 1600, t, t + 0.035, 0.07);
    this._osc('sine', 2200, t + 0.035, t + 0.07, 0.06);
    this._noise(0.04, t + 0.07, 0.04);
  }

  static playTextBlip() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 950 + (Math.random() - 0.5) * 80, t, t + 0.022, 0.04);
  }

  static playDenied() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('sawtooth', 180, t, t + 0.3, 0.25);
    this._osc('sawtooth', 120, t + 0.1, t + 0.4, 0.2);
    this._noise(0.2, t + 0.2, 0.1);
  }

  static playWantedStar() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 1046.5, t, t + 0.08, 0.2);
    this._osc('sine', 1318.5, t + 0.05, t + 0.16, 0.18);
  }

  static playMissionFailed() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    // Classic GTA Vice City deep brass doom hit
    this._osc('sawtooth', 130.81, t, t + 1.2, 0.4);
    this._osc('sawtooth', 98.0, t + 0.05, t + 1.4, 0.35);
    this._osc('sawtooth', 65.4, t + 0.1, t + 1.8, 0.38);
    this._noise(1.2, t + 0.05, 0.2);
  }

  static playSiren() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    for (let i = 0; i < 2; i++) {
      this._osc('sine', 780, t + i * 0.4, t + i * 0.4 + 0.2, 0.18);
      this._osc('sine', 960, t + i * 0.4 + 0.2, t + i * 0.4 + 0.4, 0.18);
    }
  }

  /* ── Suspense Synth Drone for Challenge Mode ── */
  static startDrone() {
    this.resume();
    if (this._droneOsc || !this._ctx || this._muted) return;
    try {
      this._droneOsc = this._ctx.createOscillator();
      this._droneGain = this._ctx.createGain();
      this._droneOsc.type = 'sawtooth';
      this._droneOsc.frequency.setValueAtTime(55, this._ctx.currentTime);
      this._droneGain.gain.setValueAtTime(0.015, this._ctx.currentTime);
      this._droneOsc.connect(this._droneGain);
      this._droneGain.connect(this._masterGain);
      this._droneOsc.start();
    } catch (_) {}
  }

  static stopDrone() {
    if (this._droneOsc) {
      try { this._droneOsc.stop(); } catch (_) {}
      this._droneOsc.disconnect();
      this._droneOsc = null;
    }
  }
}

export default SoundEngine;

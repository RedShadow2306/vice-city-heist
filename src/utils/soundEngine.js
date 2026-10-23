/**
 * soundEngine.js  -  Vice City Heist Web Audio Synthesizer
 * Built entirely with Web Audio API for zero-latency, authentic retro synth sounds.
 */

import { getAssetUrl } from "./assetPath";

class SoundEngine {
  static _ctx = null;
  static _masterGain = null;
  static _muted = false;
  static _droneOsc = null;
  static _droneGain = null;
  static _passedAudio = null;
  static _wastedAudio = null;
  static _activeManagerAudio = null;
  static _managerVoiceUrls = {
    intro: getAssetUrl('/audio/manager/manager_intro.mp3'),
    intermission_1: getAssetUrl('/audio/manager/manager_intermission_1.mp3'),
    intermission_2: getAssetUrl('/audio/manager/manager_intermission_2.mp3'),
    intermission_3: getAssetUrl('/audio/manager/manager_intermission_3.mp3'),
    victory: getAssetUrl('/audio/manager/manager_victory.mp3'),
    defeat: getAssetUrl('/audio/manager/manager_defeat.mp3'),
  };

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
    if (this._wastedAudio) this._wastedAudio.muted = Boolean(v);
    if (this._passedAudio) this._passedAudio.muted = Boolean(v);
    if (this._activeManagerAudio) {
      this._activeManagerAudio.muted = Boolean(v);
      if (v) this.stopManagerVoice();
    }
  }

  static get isMuted() { return this._muted; }

  static isManagerVoicePlaying() {
    return Boolean(this._activeManagerAudio && !this._activeManagerAudio.paused && !this._activeManagerAudio.ended);
  }

  static playManagerVoice(key, { onStart, onEnded, onError } = {}) {
    this.stopManagerVoice();
    if (this._muted) return null;
    const url = this._managerVoiceUrls[key];
    if (!url) return null;

    try {
      const audio = new Audio(url);
      audio.volume = 0.95;
      this._activeManagerAudio = audio;
      if (onStart) audio.addEventListener('play', onStart);
      if (onEnded) {
        audio.addEventListener('ended', () => {
          if (this._activeManagerAudio === audio) this._activeManagerAudio = null;
          onEnded();
        });
      }
      if (onError) {
        audio.addEventListener('error', (e) => {
          if (this._activeManagerAudio === audio) this._activeManagerAudio = null;
          onError(e);
        });
      }
      
      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn(`[ManagerVoice] Autoplay restricted for ${key}:`, err);
          if (this._activeManagerAudio === audio) this._activeManagerAudio = null;
          if (onError) onError(err);
        });
      }
      return audio;
    } catch (err) {
      console.warn(`[ManagerVoice] Failed to play ${key}:`, err);
      if (this._activeManagerAudio) this._activeManagerAudio = null;
      if (onError) onError(err);
      return null;
    }
  }

  static stopManagerVoice() {
    if (this._activeManagerAudio) {
      try {
        this._activeManagerAudio.pause();
        this._activeManagerAudio.currentTime = 0;
      } catch (_) {}
      this._activeManagerAudio = null;
    }
  }

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
    this.playWasted();
  }

  static playWasted() {
    if (this._muted) return;
    this.resume();
    try {
      if (!this._wastedAudio) {
        this._wastedAudio = new Audio(getAssetUrl("/audio/wasted.m4a"));
      }
      this._wastedAudio.muted = Boolean(this._muted);
      this._wastedAudio.currentTime = 0;
      this._wastedAudio.volume = 0.95;
      this._wastedAudio.play().catch(() => this._playWastedSynth());
    } catch (_) {
      this._playWastedSynth();
    }
  }

  static _playWastedSynth() {
    if (this._muted) return;
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    // Classic GTA Vice City deep brass doom hit with heavy reverberation & pitch drop
    this._osc('sawtooth', 130.81, t, t + 1.6, 0.45);
    this._osc('sawtooth', 98.0, t + 0.04, t + 1.8, 0.4);
    this._osc('sawtooth', 65.4, t + 0.08, t + 2.2, 0.42);
    // Sub-bass slow boom routed to masterGain
    if (this._ctx && this._masterGain) {
      try {
        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(85, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 1.5);
        gain.gain.setValueAtTime(0.65, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);
        osc.connect(gain);
        gain.connect(this._masterGain);
        osc.start(t);
        osc.stop(t + 2.4);
      } catch (_) {}
    }
    this._noise(1.5, t + 0.05, 0.3);
  }

  static playMissionPassed() {
    if (this._muted) return;
    this.resume();
    try {
      if (!this._passedAudio) {
        this._passedAudio = new Audio(getAssetUrl("/audio/mission_passed.m4a"));
      }
      this._passedAudio.muted = Boolean(this._muted);
      this._passedAudio.currentTime = 0;
      this._passedAudio.volume = 0.95;
      this._passedAudio.play().catch(() => this._playMissionPassedSynth());
    } catch (_) {
      this._playMissionPassedSynth();
    }
  }

  static _playMissionPassedSynth() {
    if (this._muted) return;
    const t = this._ctx?.currentTime ?? 0;
    // Authentic GTA Vice City celebratory synth chords + triumphant flourish
    const chords = [
      { f: 523.25, time: 0, dur: 0.28 },   // C5
      { f: 659.25, time: 0.14, dur: 0.28 },// E5
      { f: 783.99, time: 0.28, dur: 0.35 },// G5
      { f: 1046.5, time: 0.42, dur: 0.6 }, // C6
      { f: 1318.5, time: 0.60, dur: 0.75 },// E6
      { f: 1567.98, time: 0.78, dur: 0.95 }// G6
    ];
    chords.forEach(({ f, time, dur }) => {
      this._osc('sine', f, t + time, t + time + dur, 0.24);
      this._osc('triangle', f / 2, t + time, t + time + dur, 0.18);
    });
  }

  static playCameraClick() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._noise(0.06, t, 0.3);
    this._osc('triangle', 1850, t, t + 0.03, 0.18);
  }

  static playCashCount() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 987.77, t, t + 0.04, 0.12);
  }

  static playVaultClank() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    // Heavy steel bank vault locking bolt disengaging
    this._osc('triangle', 95, t, t + 0.35, 0.45);
    this._osc('sawtooth', 160, t + 0.04, t + 0.25, 0.35);
    this._osc('square', 320, t + 0.08, t + 0.18, 0.2);
    this._noise(0.35, t + 0.02, 0.28);
  }

  static playTumblerClick() {
    this.resume();
    const t = this._ctx?.currentTime ?? 0;
    this._osc('triangle', 1850 + Math.random() * 200, t, t + 0.018, 0.06);
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

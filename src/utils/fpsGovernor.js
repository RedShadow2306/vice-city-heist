/**
 * fpsGovernor.js  -  ViceFPSGovernor
 *
 * Throttles the Three.js render loop to a target FPS.
 * In "Lite FX" mode the target drops to 30 fps and heavy post-processing
 * is skipped, preserving battery / low-end GPU headroom.
 */

export class ViceFPSGovernor {
  /**
   * @param {object} opts
   * @param {number}  [opts.targetFps=60]   - normal render rate
   * @param {number}  [opts.liteFps=30]     - rate in Lite FX mode
   * @param {boolean} [opts.lite=false]     - start in Lite FX mode
   */
  constructor({ targetFps = 60, liteFps = 30, lite = false } = {}) {
    this._targetFps = targetFps;
    this._liteFps   = liteFps;
    this._lite      = lite;
    this._lastTime  = 0;
    this._rafId     = null;
    this._callback  = null;

    // Measured perf stats
    this._frames    = 0;
    this._measuredFps = 0;
    this._fpsTimer  = 0;
  }

  /* ─── public API ─────────────────────────────────────────── */

  get isLite() { return this._lite; }
  get measuredFps() { return this._measuredFps; }

  /** Switch Lite FX mode on/off at runtime. */
  setLite(v) {
    this._lite = v;
    this._lastTime = 0; // reset interval
  }

  /**
   * Start the governed render loop.
   * @param {function} callback  - called with (timestamp, deltaMs) each allowed frame
   */
  start(callback) {
    this._callback = callback;
    this._tick(0);
  }

  /** Stop the loop. */
  stop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /* ─── internals ──────────────────────────────────────────── */

  _tick(now) {
    this._rafId = requestAnimationFrame((t) => this._tick(t));

    const targetFps = this._lite ? this._liteFps : this._targetFps;
    const interval  = 1000 / targetFps;
    const delta     = now - this._lastTime;

    // FPS measurement
    this._frames++;
    this._fpsTimer += delta;
    if (this._fpsTimer >= 1000) {
      this._measuredFps = Math.round(this._frames * 1000 / this._fpsTimer);
      this._frames  = 0;
      this._fpsTimer = 0;
    }

    if (delta < interval - 1) return; // not yet time for a frame
    this._lastTime = now - (delta % interval);

    if (this._callback) {
      this._callback(now, delta);
    }
  }
}

export default ViceFPSGovernor;

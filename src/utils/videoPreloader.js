/**
 * videoPreloader.js
 * Ultra-fast persistent caching & in-memory Blob preloader for the Vice City Heist cutscene video.
 *
 * Remedies:
 * 1. Checks Cache Storage API ('vch-video-cache-v1') to serve 0ms instant playback on repeat visits.
 * 2. Streams video bytes into a local Blob URL so playback is 100% offline-immune with ZERO network buffering.
 * 3. Starts downloading immediately upon web app boot (during registration / lobby).
 * 4. Tracks real-time download progress (0% - 100%) for smooth visual loading HUD.
 */

import { getAssetUrl } from "./assetPath";

const CACHE_NAME = "vch-video-cache-v2";
const OBSOLETE_CACHES = ["vch-video-cache-v1"];
const VIDEO_PATH = "/video/heist_intro.mp4";
const ESTIMATED_SIZE = 2912922; // 2.77 MB

class VideoPreloadService {
  constructor() {
    this.blobUrl = null;
    this.progress = 0; // 0 - 100
    this.status = "idle"; // "idle" | "loading" | "ready" | "error"
    this.listeners = new Set();
    this.loadPromise = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately emit current state
    listener({ status: this.status, progress: this.progress, blobUrl: this.blobUrl });
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = { status: this.status, progress: this.progress, blobUrl: this.blobUrl };
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (_) {}
    });
  }

  getVideoUrl() {
    return this.blobUrl || getAssetUrl(VIDEO_PATH);
  }

  isReady() {
    return Boolean(this.blobUrl);
  }

  async init() {
    if (this.loadPromise) return this.loadPromise;

    // Purge any stale/choppy cache from v1
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        for (const oldKey of OBSOLETE_CACHES) {
          if (await caches.has(oldKey)) {
            await caches.delete(oldKey);
          }
        }
      }
    } catch (_) {}

    this.loadPromise = this._startPreload();
    return this.loadPromise;
  }

  async _startPreload() {
    const targetUrl = getAssetUrl(VIDEO_PATH);
    this.status = "loading";
    this.notify();

    // 1. Try Cache Storage first (instant on repeat visits)
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(targetUrl);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          this.blobUrl = URL.createObjectURL(blob);
          this.progress = 100;
          this.status = "ready";
          this.notify();
          return this.blobUrl;
        }
      }
    } catch (e) {
      console.warn("[VideoPreloader] Cache Storage lookup failed, falling back to fetch:", e);
    }

    // 2. Fetch and stream progress with throttled notifications to prevent UI thread thrashing
    try {
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const contentLength = Number(response.headers.get("Content-Length")) || ESTIMATED_SIZE;

      // Check if streaming is supported for granular progress
      if (response.body && response.body.getReader) {
        const reader = response.body.getReader();
        let receivedLength = 0;
        let lastNotifiedPct = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          const pct = Math.min(99, Math.round((receivedLength / contentLength) * 100));
          // Notify every 10% milestone to keep 3D/UI animations at 60 FPS
          if (pct - lastNotifiedPct >= 10 || pct === 99) {
            lastNotifiedPct = pct;
            this.progress = pct;
            this.notify();
          }
        }

        const fullBlob = new Blob(chunks, { type: "video/mp4" });
        this.blobUrl = URL.createObjectURL(fullBlob);
        this.progress = 100;
        this.status = "ready";
        this.notify();

        // 3. Save to Cache Storage asynchronously for next session
        try {
          if ("caches" in window) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(targetUrl, new Response(fullBlob, {
              headers: { "Content-Type": "video/mp4", "Content-Length": String(fullBlob.size) }
            })).catch(() => {});
          }
        } catch (_) {}

        return this.blobUrl;
      } else {
        // Fallback standard blob
        const blob = await response.blob();
        this.blobUrl = URL.createObjectURL(blob);
        this.progress = 100;
        this.status = "ready";
        this.notify();
        return this.blobUrl;
      }
    } catch (err) {
      console.warn("[VideoPreloader] Streaming preload failed, using direct URL:", err);
      this.status = "error";
      this.progress = 100;
      this.notify();
      return targetUrl;
    }
  }
}

export const videoPreloader = new VideoPreloadService();

// Start preloading immediately on module import
if (typeof window !== "undefined") {
  window.__VCH_VIDEO_PRELOADER = videoPreloader;
  // Trigger preload immediately in idle callback or next tick
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => videoPreloader.init(), { timeout: 1000 });
  } else {
    setTimeout(() => videoPreloader.init(), 100);
  }
}

export default videoPreloader;

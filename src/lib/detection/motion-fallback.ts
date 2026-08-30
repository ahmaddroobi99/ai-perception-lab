import type { Detection, ModelMeta, ModelRunner, PipelineTimings } from "./types";

/**
 * Honest fallback: frame-difference motion blobs.
 * Labeled SIMULATION — this is not a trained detector.
 */
export class MotionRunner implements ModelRunner {
  private canvas: HTMLCanvasElement | null = null;
  private prev: ImageData | null = null;
  private timings: PipelineTimings = {
    captureMs: 0,
    preprocessMs: 0,
    inferenceMs: 0,
    postprocessMs: 0,
    drawMs: 0,
    totalMs: 0,
    fps: 0,
  };

  getMetadata(): ModelMeta {
    return {
      id: "motion-proxy",
      name: "Frame-difference motion proxy",
      framework: "Canvas 2D",
      task: "Motion blobs (not classification)",
      capability: "sim",
      notes: "Used only if TensorFlow.js cannot load. Boxes are motion, not object classes.",
    };
  }

  getMetrics() {
    return this.timings;
  }

  async load() {
    if (typeof document === "undefined") return;
    this.canvas = document.createElement("canvas");
  }

  async predict(input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) {
    const t0 = performance.now();
    const w = "videoWidth" in input ? input.videoWidth || 320 : input.width || 320;
    const h = "videoHeight" in input ? input.videoHeight || 180 : input.height || 180;
    if (!this.canvas) this.canvas = document.createElement("canvas");
    const c = this.canvas;
    const dw = 160;
    const dh = Math.max(1, Math.round((h / w) * dw));
    c.width = dw;
    c.height = dh;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(input, 0, 0, dw, dh);
    const cur = ctx.getImageData(0, 0, dw, dh);
    const dets: Detection[] = [];
    if (this.prev) {
      let minX = dw,
        minY = dh,
        maxX = 0,
        maxY = 0,
        hits = 0;
      const a = this.prev.data;
      const b = cur.data;
      for (let y = 0; y < dh; y += 2) {
        for (let x = 0; x < dw; x += 2) {
          const i = (y * dw + x) * 4;
          const mag =
            Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
          if (mag > 80) {
            hits++;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (hits > 18) {
        const sx = w / dw;
        const sy = h / dh;
        dets.push({
          id: "motion-1",
          class: "motion",
          score: Math.min(0.95, hits / 400),
          box: {
            x: minX * sx,
            y: minY * sy,
            width: Math.max(8, (maxX - minX) * sx),
            height: Math.max(8, (maxY - minY) * sy),
          },
          source: "motion",
        });
      }
    }
    this.prev = cur;
    const ms = performance.now() - t0;
    this.timings = {
      captureMs: 0,
      preprocessMs: ms * 0.4,
      inferenceMs: ms * 0.4,
      postprocessMs: ms * 0.2,
      drawMs: 0,
      totalMs: ms,
      fps: ms > 0 ? 1000 / ms : 0,
    };
    return dets;
  }

  dispose() {
    this.prev = null;
    this.canvas = null;
  }
}

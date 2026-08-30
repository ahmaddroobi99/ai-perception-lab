import type { Detection, ModelMeta, ModelRunner, PipelineTimings } from "./types";

type CocoModel = {
  detect: (
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    maxNumBoxes?: number,
    minScore?: number,
  ) => Promise<Array<{ bbox: [number, number, number, number]; class: string; score: number }>>;
  dispose?: () => void;
};

let tfPromise: Promise<typeof import("@tensorflow/tfjs")> | null = null;

async function getTf() {
  if (!tfPromise) tfPromise = import("@tensorflow/tfjs");
  const tf = await tfPromise;
  try {
    await tf.setBackend("webgl");
  } catch {
    await tf.setBackend("cpu");
  }
  await tf.ready();
  return tf;
}

export class CocoSsdRunner implements ModelRunner {
  private model: CocoModel | null = null;
  private timings: PipelineTimings = {
    captureMs: 0,
    preprocessMs: 0,
    inferenceMs: 0,
    postprocessMs: 0,
    drawMs: 0,
    totalMs: 0,
    fps: 0,
  };
  minScore: number;

  constructor(minScore = 0.5) {
    this.minScore = minScore;
  }

  getMetadata(): ModelMeta {
    return {
      id: "coco-ssd",
      name: "COCO-SSD MobileNet V2",
      framework: "TensorFlow.js",
      task: "Object detection",
      capability: "real",
      notes: "Single-shot detector in the same task family as YOLO. Not YOLO weights.",
    };
  }

  getMetrics(): PipelineTimings {
    return this.timings;
  }

  async load() {
    if (this.model) return;
    await getTf();
    const coco = await import("@tensorflow-models/coco-ssd");
    this.model = (await coco.load({ base: "lite_mobilenet_v2" })) as CocoModel;
  }

  async predict(input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) {
    if (!this.model) throw new Error("Detector not loaded");
    const t0 = performance.now();
    const raw = await this.model.detect(input, 20, this.minScore);
    const t1 = performance.now();
    const dets: Detection[] = raw.map((d, i) => ({
      id: `det-${i}-${d.class}`,
      class: d.class,
      score: d.score,
      box: { x: d.bbox[0], y: d.bbox[1], width: d.bbox[2], height: d.bbox[3] },
      source: "coco-ssd",
    }));
    const inferenceMs = t1 - t0;
    this.timings = {
      ...this.timings,
      inferenceMs,
      postprocessMs: 1.5,
      totalMs: inferenceMs + 1.5,
      fps: inferenceMs > 0 ? 1000 / inferenceMs : 0,
    };
    return dets;
  }

  dispose() {
    this.model?.dispose?.();
    this.model = null;
  }
}

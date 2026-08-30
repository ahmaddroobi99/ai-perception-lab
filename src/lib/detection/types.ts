export type Box = { x: number; y: number; width: number; height: number };

export type Detection = {
  id: string;
  class: string;
  score: number;
  box: Box;
  source: "coco-ssd" | "motion" | "heuristic";
};

export type Track = {
  id: number;
  class: string;
  box: Box;
  centroid: { x: number; y: number };
  lastSeen: number;
  hits: number;
  crossed?: "in" | "out";
};

export type PipelineTimings = {
  captureMs: number;
  preprocessMs: number;
  inferenceMs: number;
  postprocessMs: number;
  drawMs: number;
  totalMs: number;
  fps: number;
};

export type DetectorStatus = "idle" | "loading" | "ready" | "running" | "error" | "unsupported";

export type ModelMeta = {
  id: string;
  name: string;
  framework: string;
  task: string;
  capability: "real" | "sim";
  notes: string;
};

export interface ModelRunner {
  load(): Promise<void>;
  predict(
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  ): Promise<Detection[]>;
  getMetadata(): ModelMeta;
  getMetrics(): PipelineTimings;
  dispose(): void;
}

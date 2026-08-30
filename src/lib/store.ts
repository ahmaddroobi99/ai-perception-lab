import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Detection, DetectorStatus, PipelineTimings, Track } from "./detection/types";
import type { CameraDevice } from "./camera";

export type VlmProvider = "xai" | "ollama" | "huggingface" | "openai-compat";

export type VlmConfig = {
  provider: VlmProvider;
  endpoint: string;
  model: string;
  token: string;
  temperature: number;
  maxTokens: number;
};

export type Experiment = {
  id: string;
  at: number;
  input: string;
  model: string;
  resolution: string;
  avgLatency: number;
  fps: number;
  detections: number;
  notes?: string;
};

export type ActivityItem = {
  id: string;
  at: number;
  kind: "deploy" | "infra" | "ai" | "security" | "incident" | "camera";
  text: string;
};

type SimOps = {
  devices: number;
  sensorsOnline: number;
  sensorsTotal: number;
  requests: number;
  avgInference: number;
  accuracy: number;
  uptime: number;
  gpu: number;
  cpu: number;
  mem: number;
  cost: number;
  errorRate: number;
};

type AppState = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  devices: CameraDevice[];
  setDevices: (d: CameraDevice[]) => void;
  selectedDevice: string | null;
  setSelectedDevice: (id: string | null) => void;
  resolutionId: "480" | "720" | "1080";
  setResolutionId: (id: "480" | "720" | "1080") => void;
  fpsTarget: 15 | 30 | 60;
  setFpsTarget: (n: 15 | 30 | 60) => void;
  cameraOn: boolean;
  setCameraOn: (v: boolean) => void;
  cameraError: string | null;
  setCameraError: (v: string | null) => void;
  detectorStatus: DetectorStatus;
  setDetectorStatus: (s: DetectorStatus) => void;
  detectorName: string;
  setDetectorName: (n: string) => void;
  capability: "real" | "sim";
  setCapability: (c: "real" | "sim") => void;
  confidence: number;
  setConfidence: (n: number) => void;
  detections: Detection[];
  setDetections: (d: Detection[]) => void;
  tracks: Track[];
  setTracks: (t: Track[]) => void;
  timings: PipelineTimings;
  setTimings: (t: PipelineTimings) => void;
  frameCount: number;
  bumpFrame: () => void;
  selectedDetId: string | null;
  setSelectedDetId: (id: string | null) => void;
  vlm: VlmConfig;
  setVlm: (p: Partial<VlmConfig>) => void;
  xaiAvailable: boolean | null;
  setXaiAvailable: (v: boolean) => void;
  experiments: Experiment[];
  addExperiment: (e: Omit<Experiment, "id" | "at">) => void;
  clearExperiments: () => void;
  activity: ActivityItem[];
  pushActivity: (kind: ActivityItem["kind"], text: string) => void;
  ops: SimOps;
  tickOps: () => void;
  followOpen: boolean;
  setFollowOpen: (v: boolean) => void;
};

const emptyTimings: PipelineTimings = {
  captureMs: 0,
  preprocessMs: 0,
  inferenceMs: 0,
  postprocessMs: 0,
  drawMs: 0,
  totalMs: 0,
  fps: 0,
};

const SEED_T = 1_720_000_000_000;

const seedActivity: ActivityItem[] = [
  { id: "a1", at: SEED_T - 40000, kind: "deploy", text: "Frontend lab v1.0 ready — browser inference path" },
  { id: "a2", at: SEED_T - 32000, kind: "ai", text: "COCO-SSD runner registered (TensorFlow.js)" },
  { id: "a3", at: SEED_T - 21000, kind: "infra", text: "VLM provider abstraction online (xAI / Ollama / BYOK)" },
  { id: "a4", at: SEED_T - 9000, kind: "camera", text: "Waiting for camera permission" },
];

export const useLab = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("light", theme === "light");
        }
      },
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      devices: [],
      setDevices: (devices) => set({ devices }),
      selectedDevice: null,
      setSelectedDevice: (selectedDevice) => set({ selectedDevice }),
      resolutionId: "720",
      setResolutionId: (resolutionId) => set({ resolutionId }),
      fpsTarget: 30,
      setFpsTarget: (fpsTarget) => set({ fpsTarget }),
      cameraOn: false,
      setCameraOn: (cameraOn) => set({ cameraOn }),
      cameraError: null,
      setCameraError: (cameraError) => set({ cameraError }),
      detectorStatus: "idle",
      setDetectorStatus: (detectorStatus) => set({ detectorStatus }),
      detectorName: "COCO-SSD",
      setDetectorName: (detectorName) => set({ detectorName }),
      capability: "real",
      setCapability: (capability) => set({ capability }),
      confidence: 0.5,
      setConfidence: (confidence) => set({ confidence }),
      detections: [],
      setDetections: (detections) => set({ detections }),
      tracks: [],
      setTracks: (tracks) => set({ tracks }),
      timings: emptyTimings,
      setTimings: (timings) => set({ timings }),
      frameCount: 0,
      bumpFrame: () => set({ frameCount: get().frameCount + 1 }),
      selectedDetId: null,
      setSelectedDetId: (selectedDetId) => set({ selectedDetId }),
      vlm: {
        provider: "xai",
        endpoint: "http://localhost:11434/v1/chat/completions",
        model: "grok-4.5",
        token: "",
        temperature: 0.2,
        maxTokens: 350,
      },
      setVlm: (p) => set({ vlm: { ...get().vlm, ...p } }),
      xaiAvailable: null,
      setXaiAvailable: (xaiAvailable) => set({ xaiAvailable }),
      experiments: [],
      addExperiment: (e) =>
        set({
          experiments: [
            { ...e, id: `exp-${Date.now()}`, at: Date.now() },
            ...get().experiments,
          ].slice(0, 40),
        }),
      clearExperiments: () => set({ experiments: [] }),
      activity: seedActivity,
      pushActivity: (kind, text) =>
        set({
          activity: [{ id: `act-${Date.now()}`, at: Date.now(), kind, text }, ...get().activity].slice(
            0,
            80,
          ),
        }),
      ops: {
        devices: 24,
        sensorsOnline: 68,
        sensorsTotal: 72,
        requests: 2_410_000,
        avgInference: 118,
        accuracy: 96.4,
        uptime: 99.93,
        gpu: 64,
        cpu: 41,
        mem: 58,
        cost: 18420,
        errorRate: 0.18,
      },
      tickOps: () => {
        const o = get().ops;
        const wobble = (n: number, amp: number, lo: number, hi: number) =>
          Math.min(hi, Math.max(lo, n + (Math.random() - 0.48) * amp));
        set({
          ops: {
            ...o,
            requests: o.requests + Math.round(40 + Math.random() * 90),
            avgInference: wobble(o.avgInference, 4, 96, 148),
            gpu: wobble(o.gpu, 2.2, 58, 76),
            cpu: wobble(o.cpu, 2.4, 28, 62),
            mem: wobble(o.mem, 1.4, 48, 72),
            errorRate: wobble(o.errorRate, 0.02, 0.08, 0.35),
            accuracy: wobble(o.accuracy, 0.08, 95.6, 97.1),
            sensorsOnline: Math.round(wobble(o.sensorsOnline, 0.4, 64, 72)),
          },
        });
      },
      followOpen: false,
      setFollowOpen: (followOpen) => set({ followOpen }),
    }),
    {
      name: "ai-perception-lab",
      partialize: (s) => ({
        theme: s.theme,
        resolutionId: s.resolutionId,
        fpsTarget: s.fpsTarget,
        confidence: s.confidence,
        vlm: {
          provider: s.vlm.provider,
          endpoint: s.vlm.endpoint,
          model: s.vlm.model,
          token: "",
          temperature: s.vlm.temperature,
          maxTokens: s.vlm.maxTokens,
        },
        experiments: s.experiments,
      }),
    },
  ),
);

/** Demo-only browser storage for BYOK. Never a production secret store. */
export const VLM_TOKEN_KEY = "ailab.vlm.token";

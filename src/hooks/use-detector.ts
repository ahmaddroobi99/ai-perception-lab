import { useCallback, useEffect, useRef, useState } from "react";
import { CocoSsdRunner } from "@/lib/detection/coco-ssd";
import { MotionRunner } from "@/lib/detection/motion-fallback";
import { CentroidTracker } from "@/lib/detection/tracker";
import type { Detection, ModelRunner } from "@/lib/detection/types";
import { useLab } from "@/lib/store";

export function useDetector() {
  const runnerRef = useRef<ModelRunner | null>(null);
  const trackerRef = useRef(new CentroidTracker());
  const [loadError, setLoadError] = useState<string | null>(null);
  const setStatus = useLab((s) => s.setDetectorStatus);
  const setName = useLab((s) => s.setDetectorName);
  const setCap = useLab((s) => s.setCapability);
  const setDetections = useLab((s) => s.setDetections);
  const setTracks = useLab((s) => s.setTracks);
  const setTimings = useLab((s) => s.setTimings);
  const bump = useLab((s) => s.bumpFrame);
  const confidence = useLab((s) => s.confidence);
  const pushActivity = useLab((s) => s.pushActivity);

  const ensure = useCallback(async () => {
    if (runnerRef.current) return runnerRef.current;
    setStatus("loading");
    try {
      const r = new CocoSsdRunner(confidence);
      await r.load();
      runnerRef.current = r;
      setName("COCO-SSD MobileNet V2");
      setCap("real");
      setStatus("ready");
      pushActivity("ai", "COCO-SSD loaded in the browser (TensorFlow.js / WebGL)");
      return r;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load COCO-SSD";
      setLoadError(msg);
      const fallback = new MotionRunner();
      await fallback.load();
      runnerRef.current = fallback;
      setName("Motion proxy");
      setCap("sim");
      setStatus("ready");
      pushActivity("incident", `COCO-SSD unavailable — using motion proxy (${msg})`);
      return fallback;
    }
  }, [confidence, pushActivity, setCap, setName, setStatus]);

  useEffect(() => {
    const r = runnerRef.current;
    if (r && r instanceof CocoSsdRunner) r.minScore = confidence;
  }, [confidence]);

  const infer = useCallback(
    async (input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
      const r = await ensure();
      if (!r) return [] as Detection[];
      setStatus("running");
      const t0 = performance.now();
      const dets = await r.predict(input);
      const t1 = performance.now();
      const h =
        "videoHeight" in input ? input.videoHeight || 1 : (input as HTMLImageElement).height || 1;
      const tracks = trackerRef.current.update(dets, h);
      const metrics = r.getMetrics();
      setDetections(dets);
      setTracks(tracks);
      setTimings({
        ...metrics,
        totalMs: t1 - t0,
        fps: t1 > t0 ? 1000 / (t1 - t0) : metrics.fps,
      });
      bump();
      return dets;
    },
    [bump, ensure, setDetections, setStatus, setTimings, setTracks],
  );

  const dispose = useCallback(() => {
    runnerRef.current?.dispose();
    runnerRef.current = null;
    trackerRef.current.reset();
    setStatus("idle");
    setDetections([]);
    setTracks([]);
  }, [setDetections, setStatus, setTracks]);

  return { ensure, infer, dispose, loadError, tracker: trackerRef.current };
}

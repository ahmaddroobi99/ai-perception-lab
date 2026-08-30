import { useCallback, useEffect, useRef, useState } from "react";
import {
  FPS_OPTIONS,
  RESOLUTIONS,
  friendlyCameraError,
  listVideoDevices,
  openCamera,
  stopStream,
} from "@/lib/camera";
import { useLab } from "@/lib/store";
import { useDetector } from "./use-detector";

export function useCameraLoop() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastInfer = useRef(0);
  const runningRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const { infer, dispose, loadError, tracker, ensure } = useDetector();

  const setDevices = useLab((s) => s.setDevices);
  const setSelectedDevice = useLab((s) => s.setSelectedDevice);
  const setCameraOn = useLab((s) => s.setCameraOn);
  const setCameraError = useLab((s) => s.setCameraError);
  const pushActivity = useLab((s) => s.pushActivity);

  const refreshDevices = useCallback(async () => {
    const devices = await listVideoDevices();
    setDevices(devices);
    return devices;
  }, [setDevices]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    stopStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    dispose();
    pushActivity("camera", "Camera stopped — tracks released");
  }, [dispose, pushActivity, setCameraOn]);

  const start = useCallback(async () => {
    setBusy(true);
    setCameraError(null);
    try {
      const state = useLab.getState();
      const res = RESOLUTIONS.find((r) => r.id === state.resolutionId) ?? RESOLUTIONS[1];
      const stream = await openCamera({
        deviceId: state.selectedDevice,
        width: res.w,
        height: res.h,
        fps: state.fpsTarget,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video element not mounted");
      video.srcObject = stream;
      await video.play();
      const devices = await refreshDevices();
      if (!useLab.getState().selectedDevice && devices[0]) {
        setSelectedDevice(devices[0].deviceId);
      }
      setCameraOn(true);
      pushActivity("camera", `Camera connected (${devices.length} device${devices.length === 1 ? "" : "s"})`);
      await ensure();
      runningRef.current = true;
      const loop = async (t: number) => {
        if (!runningRef.current) return;
        const minGap = 1000 / Math.min(useLab.getState().fpsTarget, 12);
        if (t - lastInfer.current >= minGap && video.readyState >= 2) {
          lastInfer.current = t;
          try {
            await infer(video);
          } catch {
            /* keep loop alive */
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      setCameraError(friendlyCameraError(err));
      setCameraOn(false);
      stopStream(streamRef.current);
      streamRef.current = null;
    } finally {
      setBusy(false);
    }
  }, [ensure, infer, pushActivity, refreshDevices, setCameraError, setCameraOn, setSelectedDevice]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      stopStream(streamRef.current);
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      useLab.getState().setCameraOn(false);
      dispose();
    };
  }, [dispose]);

  return {
    videoRef,
    start,
    stop,
    busy,
    loadError,
    tracker,
    fpsOptions: FPS_OPTIONS,
    resolutions: RESOLUTIONS,
  };
}

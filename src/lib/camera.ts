export type CameraDevice = { deviceId: string; label: string };

export const RESOLUTIONS = [
  { id: "480", label: "640×480", w: 640, h: 480 },
  { id: "720", label: "1280×720", w: 1280, h: 720 },
  { id: "1080", label: "1920×1080", w: 1920, h: 1080 },
] as const;

export const FPS_OPTIONS = [15, 30, 60] as const;

export async function listVideoDevices(): Promise<CameraDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const all = await navigator.mediaDevices.enumerateDevices();
  return all
    .filter((d) => d.kind === "videoinput")
    .map((d, i) => ({
      deviceId: d.deviceId,
      label: d.label || `Camera ${i + 1}`,
    }));
}

export async function openCamera(opts: {
  deviceId?: string | null;
  width: number;
  height: number;
  fps: number;
}): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("This browser does not expose camera access.");
  }
  const video: MediaTrackConstraints = {
    width: { ideal: opts.width },
    height: { ideal: opts.height },
    frameRate: { ideal: opts.fps },
  };
  if (opts.deviceId) video.deviceId = { exact: opts.deviceId };
  return navigator.mediaDevices.getUserMedia({ video, audio: false });
}

export function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

export function friendlyCameraError(err: unknown): string {
  const name = err instanceof Error ? err.name : "";
  const msg = err instanceof Error ? err.message : "Unknown camera error";
  if (name === "NotAllowedError") {
    return "Camera permission denied. Allow camera access in the browser and try again.";
  }
  if (name === "NotFoundError") {
    return "No camera was found. Plug in a USB camera or enable the built-in webcam.";
  }
  if (name === "NotReadableError") {
    return "The camera is already in use by another application.";
  }
  if (name === "OverconstrainedError") {
    return "That resolution/device combination is not available. Try 640×480.";
  }
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "Camera access requires HTTPS (or localhost). Deployed sites must be served over HTTPS.";
  }
  return msg;
}

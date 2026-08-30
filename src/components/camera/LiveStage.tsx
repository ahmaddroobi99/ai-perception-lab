import { useEffect } from "react";
import { CameraOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OverlayCanvas } from "./OverlayCanvas";
import { useCameraLoop } from "@/hooks/use-camera-loop";
import { useLab } from "@/lib/store";
import { CapabilityTag } from "@/components/shared/CapabilityTag";
import { cn } from "@/lib/utils";

export function LiveStage({
  autoStart = false,
  className,
  showTracks = false,
}: {
  autoStart?: boolean;
  className?: string;
  showTracks?: boolean;
}) {
  const { videoRef, start, stop, busy } = useCameraLoop();
  const cameraOn = useLab((s) => s.cameraOn);
  const cameraError = useLab((s) => s.cameraError);
  const detections = useLab((s) => s.detections);
  const tracks = useLab((s) => s.tracks);
  const selected = useLab((s) => s.selectedDetId);
  const setSelected = useLab((s) => s.setSelectedDetId);
  const status = useLab((s) => s.detectorStatus);
  const cap = useLab((s) => s.capability);
  const timings = useLab((s) => s.timings);
  const detectorName = useLab((s) => s.detectorName);
  const frameCount = useLab((s) => s.frameCount);

  useEffect(() => {
    if (autoStart && !cameraOn) void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-bg aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />
        {!cameraOn ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-2/80">
            <CameraOff className="size-8 text-subtle" />
            <p className="text-sm text-muted">Camera idle</p>
            <Button onClick={() => void start()} disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" /> : null}
              Connect camera
            </Button>
            {cameraError ? (
              <p className="max-w-md px-6 text-center text-xs text-danger">{cameraError}</p>
            ) : (
              <p className="max-w-md px-6 text-center text-xs text-subtle">
                Built-in webcam, USB, or any browser-visible camera. HTTPS is required on deployed
                sites. Frames stay on this device until you explicitly send one to a VLM.
              </p>
            )}
          </div>
        ) : (
          <OverlayCanvas
            video={videoRef.current}
            detections={detections}
            tracks={showTracks ? tracks : undefined}
            selectedId={selected}
            onSelect={setSelected}
          />
        )}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <Badge variant={cameraOn ? "danger" : "default"}>{cameraOn ? "Camera active" : "Off"}</Badge>
          <CapabilityTag value={cap} />
          {status === "loading" ? <Badge variant="info">Loading model</Badge> : null}
        </div>
        <div className="pointer-events-none absolute right-3 bottom-3 flex gap-3 font-mono text-[11px] text-fg/90">
          <span className="rounded-sm bg-bg/70 px-1.5 py-0.5 tabular-nums">
            {timings.fps.toFixed(1)} FPS
          </span>
          <span className="rounded-sm bg-bg/70 px-1.5 py-0.5 tabular-nums">
            {timings.inferenceMs.toFixed(0)} ms infer
          </span>
          <span className="rounded-sm bg-bg/70 px-1.5 py-0.5 tabular-nums">{detections.length} det</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {detectorName} · frames {frameCount.toLocaleString()} · click a box to inspect
        </span>
        {cameraOn ? (
          <Button size="sm" variant="outline" onClick={stop}>
            Stop camera
          </Button>
        ) : null}
      </div>
    </div>
  );
}

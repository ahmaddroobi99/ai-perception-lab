import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { LiveStage } from "@/components/camera/LiveStage";
import { CameraControls } from "@/components/camera/CameraControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLab } from "@/lib/store";
import { WhyPanel } from "@/components/camera/WhyPanel";
import { CapabilityTag } from "@/components/shared/CapabilityTag";

export const Route = createFileRoute("/_lab/camera")({ component: CameraPage });

function CameraPage() {
  const devices = useLab((s) => s.devices);
  const timings = useLab((s) => s.timings);
  const dets = useLab((s) => s.detections);
  const cap = useLab((s) => s.capability);
  const status = useLab((s) => s.detectorStatus);

  return (
    <div>
      <PageHeader
        eyebrow="Live camera"
        title="External & built-in cameras"
        description="The browser MediaDevices API lists every video input the OS exposes — laptop webcam, USB, capture cards, virtual cameras. Switch devices without reloading. HTTPS is required on a deployed site."
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <LiveStage showTracks />
          <Card>
            <CardHeader>
              <CardTitle>Capture settings</CardTitle>
            </CardHeader>
            <CardContent>
              <CameraControls />
              <p className="mt-4 text-xs text-subtle">
                {devices.length
                  ? `${devices.length} video input${devices.length === 1 ? "" : "s"} visible to this browser.`
                  : "Device names appear after you grant permission."}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pipeline timings</CardTitle>
              <CapabilityTag value={cap} />
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-xs">
              {[
                ["Preprocess", timings.preprocessMs],
                ["Inference", timings.inferenceMs],
                ["Postprocess", timings.postprocessMs],
                ["Total", timings.totalMs],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <span className="text-muted">{k}</span>
                  <span className="tabular-nums">{Number(v).toFixed(1)} ms</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted">FPS</span>
                <span className="tabular-nums">{timings.fps.toFixed(1)}</span>
              </div>
              <p className="pt-2 font-sans text-[11px] leading-relaxed text-subtle">
                Engine {status}. {dets.length} current detections. Inference is throttled (~12 Hz)
                so a laptop stays usable.
              </p>
            </CardContent>
          </Card>
          <WhyPanel />
        </div>
      </div>
    </div>
  );
}

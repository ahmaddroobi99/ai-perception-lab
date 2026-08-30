import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLab } from "@/lib/store";

export const Route = createFileRoute("/_lab/experiments")({ component: ExperimentsPage });

function ExperimentsPage() {
  const experiments = useLab((s) => s.experiments);
  const add = useLab((s) => s.addExperiment);
  const clear = useLab((s) => s.clearExperiments);
  const timings = useLab((s) => s.timings);
  const dets = useLab((s) => s.detections);
  const res = useLab((s) => s.resolutionId);
  const cameraOn = useLab((s) => s.cameraOn);
  const detectorName = useLab((s) => s.detectorName);

  return (
    <div>
      <PageHeader
        eyebrow="Lab book"
        title="Experiments"
        description="Snapshot the current live detector into browser storage. Useful when you change confidence, camera, or resolution."
        actions={
          <>
            <Button
              size="sm"
              disabled={!cameraOn}
              onClick={() =>
                add({
                  input: "Live camera",
                  model: detectorName,
                  resolution: res,
                  avgLatency: timings.inferenceMs,
                  fps: timings.fps,
                  detections: dets.length,
                })
              }
            >
              Save current run
            </Button>
            <Button size="sm" variant="outline" onClick={clear}>
              Clear
            </Button>
          </>
        }
      />
      {experiments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-sm text-muted">
            No experiments yet. Connect a camera, then save a run.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-2 text-[11px] tracking-wider text-muted uppercase">
              <tr>
                {["When", "Model", "Res", "Latency", "FPS", "Dets"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiments.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">
                    {new Date(e.at).toLocaleTimeString()}
                  </td>
                  <td className="px-3 py-2">{e.model}</td>
                  <td className="px-3 py-2 font-mono text-xs">{e.resolution}</td>
                  <td className="px-3 py-2 font-mono text-xs tabular-nums">
                    {e.avgLatency.toFixed(0)} ms
                  </td>
                  <td className="px-3 py-2 font-mono text-xs tabular-nums">{e.fps.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-xs tabular-nums">{e.detections}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

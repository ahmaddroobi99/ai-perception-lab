import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { LiveStage } from "@/components/camera/LiveStage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLab } from "@/lib/store";

export const Route = createFileRoute("/_lab/fusion")({ component: FusionPage });

function rangeFromBox(area: number) {
  // Fake metric: bigger box → closer. Labeled simulation.
  const r = Math.max(0.6, Math.min(18, 220000 / Math.max(area, 800)));
  return r;
}

function FusionPage() {
  const dets = useLab((s) => s.detections);
  const fused = dets.slice(0, 8).map((d) => {
    const area = d.box.width * d.box.height;
    return {
      ...d,
      range: rangeFromBox(area),
      vx: 0,
    };
  });

  return (
    <div>
      <PageHeader
        eyebrow="Multimodal"
        title="Sensor fusion"
        description="Camera gives class and appearance. LiDAR would give meters. IMU gives motion. This page fuses real boxes with a simulated range so you can see the product shape — not a Kalman filter."
      />
      <div className="mb-4 flex gap-2">
        <Badge variant="real">Camera boxes</Badge>
        <Badge variant="sim">LiDAR range</Badge>
        <Badge variant="sim">IMU motion</Badge>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <LiveStage />
        <Card>
          <CardHeader>
            <CardTitle>Fused tracks</CardTitle>
          </CardHeader>
          <CardContent>
            {fused.length === 0 ? (
              <p className="text-sm text-muted">Connect a camera to fuse detections.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-muted">
                  <tr>
                    <th className="py-1">Class</th>
                    <th>Score</th>
                    <th>Range*</th>
                  </tr>
                </thead>
                <tbody>
                  {fused.map((f) => (
                    <tr key={f.id} className="border-t border-border">
                      <td className="py-2">{f.class}</td>
                      <td className="font-mono tabular-nums">{(f.score * 100).toFixed(0)}%</td>
                      <td className="font-mono tabular-nums">{f.range.toFixed(1)} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="mt-3 text-[11px] text-subtle">
              *Range is inferred from box area, not a LiDAR return. A real stack would project
              clusters into the camera frame with calibrated extrinsics.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          ["Camera", "Rich semantics, weak metric depth, lighting sensitive"],
          ["LiDAR", "Metric geometry, sparse, expensive, no color"],
          ["IMU", "High-rate motion, drifts without vision/GPS corrections"],
        ].map(([t, b]) => (
          <Card key={t}>
            <CardContent className="p-5">
              <h3 className="text-sm font-medium">{t}</h3>
              <p className="mt-1 text-sm text-muted">{b}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

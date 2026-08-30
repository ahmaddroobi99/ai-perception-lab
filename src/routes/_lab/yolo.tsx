import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { LiveStage } from "@/components/camera/LiveStage";
import { CameraControls } from "@/components/camera/CameraControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhyPanel } from "@/components/camera/WhyPanel";
import { useLab } from "@/lib/store";

export const Route = createFileRoute("/_lab/yolo")({ component: YoloLab });

function YoloLab() {
  const dets = useLab((s) => s.detections);
  const counts = dets.reduce<Record<string, number>>((acc, d) => {
    acc[d.class] = (acc[d.class] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        eyebrow="YOLO lab"
        title="You Only Look Once"
        description="YOLO is a family of single-shot object detectors. This lab runs a real single-shot detector in the browser (COCO-SSD / TensorFlow.js) so you can see boxes, scores, NMS and FPS. Native YOLO 11 weights need Mode B — a local GPU/FastAPI runtime."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="real">Live boxes = COCO-SSD</Badge>
        <Badge variant="default">YOLO 11 = catalog / Mode B</Badge>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <div className="space-y-4">
          <LiveStage />
          <CameraControls />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How YOLO thinks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              <p>Image → backbone features → detection head → box decode → NMS → boxes.</p>
              <p>
                Two-stage detectors propose regions then classify. YOLO predicts in one pass, which
                is why it is the default for cameras and robots.
              </p>
              <p className="text-xs text-subtle">
                COCO-SSD is SSD + MobileNet, not Ultralytics YOLO, but the product surface (boxes +
                class + score + FPS) is the one you will debug in production.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Live classes</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(counts).length === 0 ? (
                <p className="text-sm text-muted">No detections yet.</p>
              ) : (
                <ul className="space-y-1 font-mono text-sm">
                  {Object.entries(counts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <li key={k} className="flex justify-between">
                        <span>{k}</span>
                        <span className="tabular-nums">{v}</span>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <WhyPanel />
        </div>
      </div>
    </div>
  );
}

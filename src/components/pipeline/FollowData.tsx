import { useEffect, useState } from "react";
import { useLab } from "@/lib/store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { t: "Camera captured frame", d: "MediaStream → HTMLVideoElement pixels" },
  { t: "Resolution", d: "Native camera size, then letterboxed for the model" },
  { t: "Preprocessing", d: "Resize / normalize / to tensor  [1, 3, H, W]" },
  { t: "Detector forward pass", d: "COCO-SSD (TFJS) or YOLO on a GPU backend" },
  { t: "Postprocessing + NMS", d: "Decode boxes, filter by confidence, suppress overlaps" },
  { t: "Tracking", d: "Centroid association → stable IDs over time" },
  { t: "Application logic", d: "Count, zone, alert, or crop an ROI" },
  { t: "Optional VLM", d: "Only if you explicitly send a frame + prompt to a provider" },
  { t: "Dashboard", d: "Metrics, overlays, experiment record" },
];

export function FollowData() {
  const open = useLab((s) => s.followOpen);
  const setOpen = useLab((s) => s.setFollowOpen);
  const frame = useLab((s) => s.frameCount);
  const dets = useLab((s) => s.detections);
  const timings = useLab((s) => s.timings);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    const id = window.setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 700);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Follow the data</DialogTitle>
        <p className="mt-1 text-sm text-muted">
          Frame #{frame || 0} · {dets.length} detections · {timings.totalMs.toFixed(0)} ms last pass
        </p>
        <ol className="mt-4 space-y-2">
          {STEPS.map((s, i) => (
            <li
              key={s.t}
              className={`rounded-md border px-3 py-2 ${i <= step ? "border-primary/40 bg-accent" : "border-border opacity-40"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{s.t}</p>
                {i === 3 ? <Badge variant="real">Real when camera is on</Badge> : null}
                {i === 7 ? <Badge variant="api">Opt-in</Badge> : null}
              </div>
              <p className="text-xs text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}

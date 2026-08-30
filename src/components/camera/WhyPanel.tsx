import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLab } from "@/lib/store";

export function WhyPanel() {
  const dets = useLab((s) => s.detections);
  const selected = useLab((s) => s.selectedDetId);
  const det = dets.find((d) => d.id === selected) ?? dets[0];

  if (!det) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Why did the model say this?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Run the camera. Click a box. Confidence is a model score — not a calibrated probability
          and not ground truth.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why did the model say this?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="text-muted">Class </span>
          <span className="font-medium">{det.class}</span>
        </p>
        <p>
          <span className="text-muted">Score </span>
          <span className="font-mono tabular-nums">{(det.score * 100).toFixed(1)}%</span>
        </p>
        <p>
          <span className="text-muted">Source </span>
          {det.source === "coco-ssd"
            ? "COCO-SSD head after NMS"
            : det.source === "motion"
              ? "Frame-difference motion proxy (simulation)"
              : "Heuristic"}
        </p>
        <p className="text-xs leading-relaxed text-subtle">
          The network maps a resized RGB tensor to box + class logits. Postprocessing keeps boxes
          above your confidence slider and suppresses overlaps (NMS). A 94% score means the head is
          peaked — it does not mean 94% of similar pixels in the world are that class.
        </p>
      </CardContent>
    </Card>
  );
}

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useLab } from "@/lib/store";
import { RESOLUTIONS, FPS_OPTIONS } from "@/lib/camera";

export function CameraControls() {
  const devices = useLab((s) => s.devices);
  const selected = useLab((s) => s.selectedDevice);
  const setSelected = useLab((s) => s.setSelectedDevice);
  const res = useLab((s) => s.resolutionId);
  const setRes = useLab((s) => s.setResolutionId);
  const fps = useLab((s) => s.fpsTarget);
  const setFps = useLab((s) => s.setFpsTarget);
  const confidence = useLab((s) => s.confidence);
  const setConfidence = useLab((s) => s.setConfidence);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label>Camera</Label>
        <Select
          value={selected ?? "default"}
          onValueChange={(v) => setSelected(v === "default" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default device</SelectItem>
            {devices.map((d) => (
              <SelectItem key={d.deviceId} value={d.deviceId}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Resolution</Label>
        <Select value={res} onValueChange={(v) => setRes(v as typeof res)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESOLUTIONS.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Capture FPS target</Label>
        <Select value={String(fps)} onValueChange={(v) => setFps(Number(v) as typeof fps)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FPS_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} FPS
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Confidence</Label>
          <span className="font-mono text-xs tabular-nums text-muted">{confidence.toFixed(2)}</span>
        </div>
        <Slider
          min={0.1}
          max={0.9}
          step={0.05}
          value={[confidence]}
          onValueChange={([v]) => setConfidence(v ?? 0.5)}
        />
      </div>
    </div>
  );
}

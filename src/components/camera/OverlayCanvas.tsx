import { useEffect, useRef } from "react";
import type { Detection, Track } from "@/lib/detection/types";

function colorFor(label: string) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) % 360;
  return `hsl(${h} 40% 70%)`;
}

export function OverlayCanvas({
  video,
  detections,
  tracks,
  selectedId,
  onSelect,
}: {
  video: HTMLVideoElement | null;
  detections: Detection[];
  tracks?: Track[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !video) return;
    const w = video.clientWidth;
    const h = video.clientHeight;
    const vw = video.videoWidth || w;
    const vh = video.videoHeight || h;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const sx = w / vw;
    const sy = h / vh;
    for (const d of detections) {
      const x = d.box.x * sx;
      const y = d.box.y * sy;
      const bw = d.box.width * sx;
      const bh = d.box.height * sy;
      const col = colorFor(d.class);
      ctx.strokeStyle = d.id === selectedId ? "#e8edf2" : col;
      ctx.lineWidth = d.id === selectedId ? 2.5 : 1.5;
      ctx.strokeRect(x, y, bw, bh);
      const label = `${d.class}  ${(d.score * 100).toFixed(0)}%`;
      ctx.font = "11px IBM Plex Mono, ui-monospace, monospace";
      const tw = ctx.measureText(label).width + 10;
      ctx.fillStyle = "rgba(8,9,11,0.82)";
      ctx.fillRect(x, Math.max(0, y - 18), tw, 18);
      ctx.fillStyle = col;
      ctx.fillText(label, x + 5, Math.max(12, y - 5));
    }
    if (tracks) {
      ctx.strokeStyle = "rgba(142,184,201,0.35)";
      ctx.setLineDash([4, 4]);
      const ly = h * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, ly);
      ctx.lineTo(w, ly);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [video, detections, tracks, selectedId]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      onClick={(e) => {
        if (!onSelect || !video) return;
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const sx = rect.width / (video.videoWidth || rect.width);
        const sy = rect.height / (video.videoHeight || rect.height);
        const hit = [...detections].reverse().find((d) => {
          const x = d.box.x * sx;
          const y = d.box.y * sy;
          return px >= x && py >= y && px <= x + d.box.width * sx && py <= y + d.box.height * sy;
        });
        if (hit) onSelect(hit.id);
      }}
    />
  );
}

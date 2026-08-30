import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLab } from "@/lib/store";
import { MODEL_CARDS } from "@/data/models";
import { CapabilityTag } from "@/components/shared/CapabilityTag";
import { MetricCard } from "@/components/shared/MetricCard";
import { ClientOnly } from "@/components/shared/ClientOnly";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_lab/performance")({ component: PerfPage });

function PerfPage() {
  const t = useLab((s) => s.timings);
  const cameraOn = useLab((s) => s.cameraOn);
  const dets = useLab((s) => s.detections);
  const stages = [
    { name: "Pre", ms: t.preprocessMs || 4 },
    { name: "Infer", ms: t.inferenceMs || 0 },
    { name: "Post", ms: t.postprocessMs || 2 },
    { name: "Draw", ms: t.drawMs || 3 },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Telemetry"
        title="Performance"
        description="Live numbers come from the in-browser detector. Other model rows are catalog figures — not this laptop's GPU."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="FPS"
          value={cameraOn ? t.fps.toFixed(1) : "—"}
          capability={cameraOn ? "real" : "catalog"}
        />
        <MetricCard
          label="Inference"
          value={cameraOn ? `${t.inferenceMs.toFixed(0)} ms` : "—"}
          capability={cameraOn ? "real" : "catalog"}
        />
        <MetricCard
          label="End-to-end"
          value={cameraOn ? `${t.totalMs.toFixed(0)} ms` : "—"}
          capability={cameraOn ? "real" : "catalog"}
        />
        <MetricCard
          label="Detections"
          value={String(dets.length)}
          capability={cameraOn ? "real" : "catalog"}
        />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stage time</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ClientOnly fallback={<div className="h-full rounded-md bg-secondary/40" />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stages}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Bar dataKey="ms" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Browser vs catalog</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] tracking-wider text-muted uppercase">
                <tr>
                  <th className="py-1">Model</th>
                  <th>FPS</th>
                  <th>ms</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {MODEL_CARDS.slice(0, 6).map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="py-2">{m.name}</td>
                    <td className="font-mono text-xs">{m.expectedFps}</td>
                    <td className="font-mono text-xs">{m.expectedLatencyMs}</td>
                    <td>
                      <CapabilityTag value={m.capability} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-subtle">
              Higher FPS is not automatically better accuracy. GPU telemetry is unavailable in this
              tab unless the browser exposes it — we do not invent a percentage.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

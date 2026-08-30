import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Camera, Cpu, Gauge, Radio } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLab } from "@/lib/store";
import { formatClock, formatCompact, formatNumber } from "@/lib/utils";
import { CapabilityTag } from "@/components/shared/CapabilityTag";
import { ClientOnly } from "@/components/shared/ClientOnly";

export const Route = createFileRoute("/_lab/dashboard")({ component: Dashboard });

const services = [
  { name: "Vision API", up: 99.98, state: "ok" as const },
  { name: "LLM Gateway", up: 99.95, state: "ok" as const },
  { name: "Vector DB", up: 99.99, state: "ok" as const },
  { name: "Data Pipeline", up: 99.91, state: "warn" as const },
  { name: "Browser detector", up: 100, state: "ok" as const, real: true },
];

function series() {
  return Array.from({ length: 24 }, (_, i) => ({
    t: `${i}:00`,
    req: 70 + Math.round(Math.sin(i / 2.2) * 18 + (i % 5) * 2),
    lat: 110 + Math.round(Math.cos(i / 3) * 16 + (i % 4)),
  }));
}

function Dashboard() {
  const ops = useLab((s) => s.ops);
  const activity = useLab((s) => s.activity);
  const timings = useLab((s) => s.timings);
  const cameraOn = useLab((s) => s.cameraOn);
  const dets = useLab((s) => s.detections);
  const data = series();

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Command center"
        description="Mix of live browser telemetry and a labeled simulated fleet — the shape of a real AI ops console."
        actions={
          <Button asChild size="sm">
            <Link to="/camera">
              <Camera /> Live camera
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Edge devices"
          value={String(ops.devices)}
          delta="catalog fleet"
          icon={Radio}
          capability="sim"
        />
        <MetricCard
          label="Online sensors"
          value={`${ops.sensorsOnline} / ${ops.sensorsTotal}`}
          icon={Cpu}
          capability="sim"
        />
        <MetricCard
          label="Inference requests"
          value={formatCompact(ops.requests)}
          delta="▲ simulated volume"
          capability="sim"
        />
        <MetricCard
          label="Browser infer"
          value={cameraOn ? `${timings.inferenceMs.toFixed(0)} ms` : "—"}
          hint={cameraOn ? `${timings.fps.toFixed(1)} FPS · ${dets.length} det` : "Connect a camera"}
          icon={Gauge}
          capability={cameraOn ? "real" : "catalog"}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sim. accuracy" value={`${ops.accuracy.toFixed(1)}%`} capability="sim" />
        <MetricCard label="Sim. uptime" value={`${ops.uptime.toFixed(2)}%`} capability="sim" />
        <MetricCard label="Sim. GPU" value={`${ops.gpu.toFixed(0)}%`} capability="sim" />
        <MetricCard label="Error rate" value={`${ops.errorRate.toFixed(2)}%`} capability="sim" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Request volume & latency</CardTitle>
              <p className="text-xs text-muted">Simulated 24h fleet curve</p>
            </div>
            <CapabilityTag value="sim" />
          </CardHeader>
          <CardContent className="h-56">
            <ClientOnly fallback={<div className="h-full rounded-md bg-secondary/40" />}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="req"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.15}
                  />
                  <Area
                    type="monotone"
                    dataKey="lat"
                    stroke="var(--color-chart-2)"
                    fill="var(--color-chart-2)"
                    fillOpacity={0.08}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className={
                        s.state === "ok"
                          ? "size-1.5 rounded-full bg-ok"
                          : "size-1.5 rounded-full bg-warn"
                      }
                    />
                    {s.name}
                  </span>
                  <span className="font-mono text-xs tabular-nums">
                    {s.up.toFixed(2)}%
                    {s.real ? (
                      <Badge className="ml-2" variant="real">
                        Real
                      </Badge>
                    ) : null}
                  </span>
                </div>
                <Progress value={s.up} barClassName={s.state === "ok" ? "bg-ok" : "bg-warn"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["CPU", ops.cpu],
              ["Memory", ops.mem],
              ["GPU", ops.gpu],
              ["Storage", 44],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{k}</span>
                  <span className="font-mono tabular-nums">{formatNumber(Number(v), 0)}%</span>
                </div>
                <Progress value={Number(v)} />
              </div>
            ))}
            <p className="text-xs text-subtle">Simulated host telemetry — browser has no CUDA probe.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activity</CardTitle>
            <CapabilityTag value="sim" />
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.slice(0, 7).map((a) => (
              <div key={a.id} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 font-mono text-[11px] text-subtle tabular-nums">
                  {formatClock(a.at)}
                </span>
                <span className="text-muted">{a.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

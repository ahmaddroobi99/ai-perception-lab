import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { USE_CASES } from "@/data/use-cases";
import { LiveStage } from "@/components/camera/LiveStage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLab } from "@/lib/store";
import { MetricCard } from "@/components/shared/MetricCard";

export const Route = createFileRoute("/_lab/use-cases/$slug")({ component: UseCaseDetail });

function UseCaseDetail() {
  const { slug } = Route.useParams();
  const uc = USE_CASES.find((u) => u.slug === slug);
  const dets = useLab((s) => s.detections);
  const tracks = useLab((s) => s.tracks);

  const kpis = useMemo(() => {
    if (!uc) return [];
    const people = dets.filter((d) => d.class === "person").length;
    const vehicles = dets.filter((d) =>
      ["car", "truck", "bus", "motorcycle", "bicycle"].includes(d.class),
    ).length;
    const animals = dets.filter((d) => uc.cocoClasses.includes(d.class) && d.class !== "person").length;
    const objects = uc.cocoClasses.length
      ? dets.filter((d) => uc.cocoClasses.includes(d.class)).length
      : dets.length;
    const map: Record<string, string> = {
      people: String(people),
      entered: String(tracks.filter((t) => t.crossed === "in").length),
      exited: String(tracks.filter((t) => t.crossed === "out").length),
      peak: String(people),
      vehicles: String(vehicles),
      peds: String(people),
      density: vehicles > 6 ? "High" : vehicles > 2 ? "Med" : "Low",
      congestion: vehicles > 6 ? "Busy" : "Clear",
      objects: String(objects),
      animals: String(animals),
      species: String(new Set(dets.map((d) => d.class)).size),
      events: String(dets.length),
      empty: dets.length ? "0" : "1",
      alerts: people > 0 && vehicles > 0 ? "1" : "0",
      risk: people > 3 ? "Elevated" : "Nominal",
      dwell: String(Math.min(90, tracks.reduce((s, t) => s + t.hits, 0))),
      baskets: String(dets.filter((d) => ["handbag", "backpack", "bottle"].includes(d.class)).length),
      zones: people ? "1" : "0",
      nearest: objects ? "~1.8 m*" : "—",
      fused: String(objects),
      obstacles: String(objects),
      clear: objects ? "Check" : "Open",
      defects: "sim",
      severity: "n/a",
      area: "—",
      decision: "Review",
      fields: "5",
      conf: "sim",
      pages: "1",
      ms: "—",
      crop: objects ? "ready" : "none",
      vlm: "opt-in",
      tokens: "—",
      sentence: people ? "Person in view" : "Quiet scene",
      players: String(people),
      ball: dets.some((d) => d.class === "sports ball") ? "yes" : "no",
      trails: String(tracks.length),
      motion: tracks.length ? "yes" : "no",
      person: people ? "yes" : "no",
      pet: dets.some((d) => d.class === "dog" || d.class === "cat") ? "yes" : "no",
      pkg: dets.some((d) => ["suitcase", "backpack", "handbag"].includes(d.class)) ? "maybe" : "no",
      fps: "see perf",
      lat: "see perf",
      e2e: "see perf",
      dets: String(dets.length),
    };
    return uc.kpis.map((k) => ({ ...k, value: map[k.key] ?? "—" }));
  }, [dets, tracks, uc]);

  if (!uc) {
    return (
      <div>
        <p className="text-sm text-muted">Unknown use case.</p>
        <Button asChild variant="outline" className="mt-3">
          <Link to="/use-cases">Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Use case"
        title={uc.title}
        description={uc.summary}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/use-cases">All cases</Link>
          </Button>
        }
      />
      <p className="mb-4 font-mono text-xs text-muted">{uc.pipeline.join(" → ")}</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <MetricCard key={k.key} label={k.label} value={k.value} capability="real" />
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <LiveStage showTracks={uc.slug === "people-counter" || uc.slug === "sports"} />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Watched classes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1">
              {uc.cocoClasses.length ? (
                uc.cocoClasses.map((c) => (
                  <Badge key={c} variant="real">
                    {c}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted">No live COCO filter — see honesty note.</span>
              )}
              {uc.extraSimulated?.map((c) => (
                <Badge key={c} variant="sim">
                  {c}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What you should learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted">
              <p>{uc.teaching}</p>
              <p className="text-xs text-subtle">{uc.honesty}</p>
              <p className="font-mono text-[11px] text-subtle">{uc.architecture}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PIPE_NODES, type PipeNode } from "@/data/pipeline";
import { CapabilityTag } from "@/components/shared/CapabilityTag";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_lab/pipelines")({ component: PipelinesPage });

function PipelinesPage() {
  const [open, setOpen] = useState<PipeNode | null>(null);
  return (
    <div>
      <PageHeader
        eyebrow="Pipelines"
        title="Perception pipeline"
        description="A production stack is a directed graph, not a single model. Click a stage. Colors mark what this browser actually runs."
      />
      <div className="flex flex-col gap-0">
        {PIPE_NODES.map((n, i) => (
          <div key={n.id} className="flex flex-col items-stretch">
            <button
              onClick={() => setOpen(n)}
              className={cn(
                "flex flex-col gap-2 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between",
                n.status === "ok" && "border-ok/30",
                n.status === "warn" && "border-warn/30",
                n.status === "idle" && "border-border",
              )}
            >
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted">{n.detail}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-mono text-muted">{n.latency}</span>
                <CapabilityTag value={n.capability} />
              </div>
            </button>
            {i < PIPE_NODES.length - 1 ? (
              <div className="flex justify-center py-1">
                <span className="h-4 w-px bg-border" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
        {open ? (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{open.title}</SheetTitle>
              <SheetDescription>Stage inspect</SheetDescription>
            </SheetHeader>
            <div className="space-y-3 p-5 text-sm">
              <p className="text-muted">{open.detail}</p>
              <p>
                Latency: <span className="font-mono">{open.latency}</span>
              </p>
              <p>
                Throughput: <span className="font-mono">{open.throughput}</span>
              </p>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MODEL_CARDS, FRAMEWORK_ROLES } from "@/data/models";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapabilityTag } from "@/components/shared/CapabilityTag";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ModelCard } from "@/data/models";

export const Route = createFileRoute("/_lab/models")({ component: ModelsPage });

function ModelsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<ModelCard | null>(null);
  const rows = useMemo(() => {
    return MODEL_CARDS.filter((m) => {
      const hit = (m.name + m.framework + m.task).toLowerCase().includes(q.toLowerCase());
      const st = status === "all" || m.status === status;
      return hit && st;
    });
  }, [q, status]);

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="AI models"
        description="Runnable vs catalog. Only COCO-SSD is executed in this browser. Other rows describe production systems you would attach via Mode B/C."
      />
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {FRAMEWORK_ROLES.map((r) => (
          <Card key={r.name}>
            <CardContent className="p-4">
              <p className="text-sm font-medium">{r.name}</p>
              <p className="mt-1 text-xs text-muted">{r.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search models" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="runnable">Runnable here</SelectItem>
            <SelectItem value="requires-backend">Requires backend</SelectItem>
            <SelectItem value="requires-token">Requires token</SelectItem>
            <SelectItem value="educational">Educational</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface-2 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              {["Model", "Version", "Framework", "Task", "Latency", "Status", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-t border-border hover:bg-accent/40">
                <td className="px-3 py-3 font-medium">{m.name}</td>
                <td className="px-3 py-3 font-mono text-xs">{m.version}</td>
                <td className="px-3 py-3 text-muted">{m.framework}</td>
                <td className="px-3 py-3 text-muted">{m.task}</td>
                <td className="px-3 py-3 font-mono text-xs tabular-nums">
                  {m.status === "runnable" ? `~${m.expectedLatencyMs} ms` : `${m.expectedLatencyMs} ms*`}
                </td>
                <td className="px-3 py-3">
                  <CapabilityTag value={m.capability} />
                </td>
                <td className="px-3 py-3">
                  <button className="text-xs text-primary" onClick={() => setOpen(m)}>
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-subtle">* Catalog latency — not measured in this session.</p>

      <Sheet open={!!open} onOpenChange={() => setOpen(null)}>
        {open ? (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{open.name}</SheetTitle>
              <SheetDescription>{open.task}</SheetDescription>
            </SheetHeader>
            <div className="space-y-3 overflow-y-auto p-5 text-sm">
              {(
                [
                  ["Framework", open.framework],
                  ["Input", open.input],
                  ["Output", open.output],
                  ["Parameters", open.parameters],
                  ["Size", open.size],
                  ["Hardware", open.hardware],
                  ["Use", open.typicalUse],
                  ["Strengths", open.strengths],
                  ["Weaknesses", open.weaknesses],
                  ["Latency", open.latencyNote],
                  ["Privacy", open.privacy],
                  ["Accuracy", open.accuracyNote],
                  ["Related", open.relatedTo ?? "—"],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <p className="text-[11px] tracking-wider text-subtle uppercase">{k}</p>
                  <p className="text-muted">{v}</p>
                </div>
              ))}
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  );
}

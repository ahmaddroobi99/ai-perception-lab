import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { CapabilityTag } from "./CapabilityTag";

export function MetricCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  capability,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  icon?: LucideIcon;
  capability?: "real" | "sim" | "catalog";
}) {
  const up = delta?.startsWith("▲") || delta?.startsWith("+");
  const down = delta?.startsWith("▼") || delta?.startsWith("-");
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium tracking-wider text-muted uppercase">{label}</p>
          {Icon ? <Icon className="size-3.5 text-subtle" /> : null}
        </div>
        <p className="mt-2 font-mono text-2xl font-medium tracking-tight tabular-nums">{value}</p>
        <div className="mt-2 flex items-center gap-2">
          {delta ? (
            <span
              className={cn(
                "text-xs tabular-nums",
                up && "text-ok",
                down && "text-danger",
                !up && !down && "text-muted",
              )}
            >
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
          {capability ? <CapabilityTag value={capability} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

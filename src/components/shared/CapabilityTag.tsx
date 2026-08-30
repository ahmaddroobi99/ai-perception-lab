import { Badge } from "@/components/ui/badge";
import type { Capability } from "@/data/models";

const map: Record<Capability, { label: string; variant: "real" | "sim" | "api" | "local" | "default" }> = {
  real: { label: "Real", variant: "real" },
  sim: { label: "Simulation", variant: "sim" },
  api: { label: "API", variant: "api" },
  local: { label: "Local", variant: "local" },
  browser: { label: "Browser", variant: "real" },
  catalog: { label: "Catalog", variant: "default" },
};

export function CapabilityTag({ value }: { value: Capability | "real" | "sim" }) {
  const m = map[value] ?? map.catalog;
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

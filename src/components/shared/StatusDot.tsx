import { cn } from "@/lib/utils";

export function StatusDot({
  state,
  label,
}: {
  state: "ok" | "warn" | "danger" | "idle";
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted uppercase">
      <span
        className={cn(
          "size-1.5 rounded-full",
          state === "ok" && "bg-ok",
          state === "warn" && "bg-warn",
          state === "danger" && "bg-danger",
          state === "idle" && "bg-subtle",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

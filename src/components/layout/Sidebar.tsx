import { Link, useRouterState } from "@tanstack/react-router";
import { Aperture, X } from "lucide-react";
import { NAV_GROUPS } from "@/data/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLab } from "@/lib/store";

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const open = useLab((s) => s.sidebarOpen);
  const setOpen = useLab((s) => s.setSidebarOpen);

  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-40 bg-bg/60 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface md:static md:z-0",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2 text-fg" onClick={() => setOpen(false)}>
            <Aperture className="size-4 text-primary" />
            <span className="text-sm font-medium tracking-tight">Perception Lab</span>
          </Link>
          <Button
            size="icon-sm"
            variant="ghost"
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((g) => (
            <div key={g.title} className="mb-5">
              <p className="px-2 pb-2 text-[10px] font-medium tracking-[0.14em] text-subtle uppercase">
                {g.title}
              </p>
              <ul className="space-y-0.5">
                {g.items.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                          active
                            ? "bg-accent text-fg"
                            : "text-muted hover:bg-accent/60 hover:text-fg",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-subtle">
          Browser inference is real. Fleet GPU numbers are simulated. VLM calls are opt-in.
        </p>
      </aside>
    </>
  );
}

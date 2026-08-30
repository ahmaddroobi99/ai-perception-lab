import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ALL_NAV } from "@/data/nav";
import { LESSONS } from "@/data/learning";
import { USE_CASES } from "@/data/use-cases";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const query = q.trim().toLowerCase();

  const pages = ALL_NAV.filter((n) => n.label.toLowerCase().includes(query));
  const cases = USE_CASES.filter(
    (u) => u.title.toLowerCase().includes(query) || u.slug.includes(query),
  );
  const lessons = LESSONS.filter(
    (l) => l.title.toLowerCase().includes(query) || l.slug.includes(query),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function go(to: string) {
    onOpenChange(false);
    setQ("");
    void navigate({ to });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="border-b border-border p-3">
          <Input
            autoFocus
            placeholder="Search pages, use cases, lessons…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          <Section title="Pages">
            {pages.map((n) => (
              <button
                key={n.to}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                onClick={() => go(n.to)}
              >
                <n.icon className="size-4 text-muted" />
                {n.label}
              </button>
            ))}
          </Section>
          {cases.length ? (
            <Section title="Use cases">
              {cases.map((u) => (
                <button
                  key={u.slug}
                  className="flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => go(`/use-cases/${u.slug}`)}
                >
                  {u.title}
                </button>
              ))}
            </Section>
          ) : null}
          {lessons.length ? (
            <Section title="Lessons">
              {lessons.map((l) => (
                <button
                  key={l.slug}
                  className="flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => go(`/learning/${l.slug}`)}
                >
                  {l.title}
                </button>
              ))}
            </Section>
          ) : null}
        </div>
        <p className="border-t border-border px-3 py-2 text-[11px] text-subtle">
          Ctrl / ⌘ K · Enter a page
        </p>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1 text-[10px] tracking-wider text-subtle uppercase">{title}</p>
      {children}
    </div>
  );
}

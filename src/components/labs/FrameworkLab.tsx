import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

type LabLink = "/architecture" | "/camera" | "/vlm";

export function FrameworkLab({
  eyebrow,
  title,
  lede,
  steps,
  compare,
  honesty,
  cta,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  steps: { title: string; body: string }[];
  compare: { k: string; v: string }[];
  honesty: string;
  cta?: { to: LabLink; label: string };
}) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={lede} />
      <div className="mb-5">
        <Badge variant="sim">Educational</Badge>
      </div>
      <div className="relative mb-8">
        <div className="absolute top-4 right-4 left-4 hidden h-px bg-border md:block" />
        <ol className="grid gap-3 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-border bg-card p-4">
              <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-sm font-medium">{s.title}</h3>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role in the stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {compare.map((c) => (
              <div key={c.k} className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-muted">{c.k}</span>
                <span>{c.v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Honesty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>{honesty}</p>
            {cta ? (
              <Button asChild size="sm">
                <Link to={cta.to}>{cta.label}</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

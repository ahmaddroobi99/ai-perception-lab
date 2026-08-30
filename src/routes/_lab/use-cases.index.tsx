import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { USE_CASES } from "@/data/use-cases";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_lab/use-cases/")({ component: UseCasesPage });

function UseCasesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Applications"
        title="Specialized use cases"
        description="Each case is a thin policy layer on the same detector. That is how real products are built — one perception stack, many jobs."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {USE_CASES.map((u) => (
          <Link key={u.slug} to="/use-cases/$slug" params={{ slug: u.slug }} className="group">
            <Card className="h-full transition-colors group-hover:bg-accent/30">
              <CardContent className="flex h-full flex-col p-5">
                <h2 className="text-sm font-medium">{u.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{u.summary}</p>
                <p className="mt-4 flex items-center gap-1 text-xs text-primary">
                  Open lab <ArrowRight className="size-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { LESSONS } from "@/data/learning";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_lab/learning/")({ component: LearningPage });

function LearningPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Curriculum"
        title="Learning center"
        description="Short, precise notes for the stack you just ran. Read them after you have seen a box appear on your own camera."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {LESSONS.map((l) => (
          <Link key={l.slug} to="/learning/$slug" params={{ slug: l.slug }}>
            <Card className="h-full hover:bg-accent/30">
              <CardContent className="p-5">
                <h2 className="text-sm font-medium">{l.title}</h2>
                <p className="mt-2 text-sm text-muted">{l.blurb}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

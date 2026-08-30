import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { LESSONS } from "@/data/learning";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_lab/learning/$slug")({ component: LessonPage });

function LessonPage() {
  const { slug } = Route.useParams();
  const lesson = LESSONS.find((l) => l.slug === slug);
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;

  if (!lesson) {
    return <p className="text-sm text-muted">Lesson not found.</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Lesson"
        title={lesson.title}
        description={lesson.blurb}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/learning">All lessons</Link>
          </Button>
        }
      />
      <article className="max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        {lesson.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </article>
      <div className="mt-8 flex justify-between gap-3">
        {prev ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/learning/$slug" params={{ slug: prev.slug }}>
              {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/learning/$slug" params={{ slug: next.slug }}>
              {next.title}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

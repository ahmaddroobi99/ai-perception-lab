import { Button } from "@/components/ui/button";
import { useLab } from "@/lib/store";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const setFollow = useLab((s) => s.setFollowOpen);
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {actions}
        <Button variant="outline" size="sm" onClick={() => setFollow(true)}>
          Follow the data
        </Button>
      </div>
    </div>
  );
}

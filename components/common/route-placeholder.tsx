import Link from "next/link";

type PlaceholderLink = {
  href: string;
  label: string;
};

type RoutePlaceholderProps = {
  actions?: string[];
  links?: PlaceholderLink[];
  path: string;
  purpose: string;
  sections?: string[];
  title: string;
  scope: "Public" | "Private";
};

export function RoutePlaceholder({
  actions = [],
  links = [],
  path,
  purpose,
  sections = [],
  title,
  scope,
}: RoutePlaceholderProps) {
  return (
    <main className="min-h-svh bg-background px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Patch MVP {scope} Route
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <div className="rounded-lg border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Path:</span> {path}
        </div>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Purpose
          </h2>
          <p className="text-sm text-foreground">{purpose}</p>
        </section>

        {actions.length > 0 ? (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Actions
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {sections.length > 0 ? (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Sections
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {sections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {links.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Navigate
            </h2>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

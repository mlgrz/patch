import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/services/actions";

export default function DeveloperProfilePage() {
  return (
    <main className="min-h-svh bg-background px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Patch MVP Private Route
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Developer Profile</h1>
        <div className="rounded-lg border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Path:</span> /dev/profile
        </div>
        <p className="text-sm text-foreground">Manage your developer account session.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dev/dashboard"
            className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link
            href="/dev/projects/create-project"
            className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Create project
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="destructive">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

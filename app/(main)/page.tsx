import Link from "next/link";

export default function LandingPage() {
  const demoProjectId = "demo-project";

  return (
    <main className="min-h-svh bg-gradient-to-b from-amber-50 via-white to-orange-50 px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-5">
          <p className="inline-flex w-fit rounded-full border border-orange-200 bg-orange-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-800">
            Patch MVP Placeholder
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Patch helps teams turn feedback into issues and ship visible progress.
          </h1>
          <p className="max-w-2xl text-base text-slate-700 sm:text-lg">
            This is the current route hub for the Patch MVP draft.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-orange-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Public routes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>
                <Link href="/" className="underline underline-offset-2">
                  /
                </Link>
              </li>
              <li>
                <Link href={`/p/${demoProjectId}/submit-report`} className="underline underline-offset-2">
                  /p/[projectId]/submit-report
                </Link>
              </li>
              <li>
                <Link href={`/p/${demoProjectId}/roadmap`} className="underline underline-offset-2">
                  /p/[projectId]/roadmap
                </Link>
              </li>
              <li>
                <Link href={`/p/${demoProjectId}/releases`} className="underline underline-offset-2">
                  /p/[projectId]/releases
                </Link>
              </li>
            </ul>
          </article>
          <article className="rounded-2xl border border-orange-100 bg-white/90 p-6 shadow-sm lg:col-span-1">
            <h2 className="text-lg font-semibold">Private routes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>
                <Link href="/dev/dashboard" className="underline underline-offset-2">
                  /dev/dashboard
                </Link>
              </li>
              <li>
                <Link href="/dev/projects/create-project" className="underline underline-offset-2">
                  /dev/projects/create-project
                </Link>
              </li>
              <li>
                <Link href={`/dev/projects/${demoProjectId}/overview`} className="underline underline-offset-2">
                  /dev/projects/[projectId]/overview
                </Link>
              </li>
              <li>
                <Link href={`/dev/projects/${demoProjectId}/reports`} className="underline underline-offset-2">
                  /dev/projects/[projectId]/reports
                </Link>
              </li>
              <li>
                <Link href={`/dev/projects/${demoProjectId}/issues`} className="underline underline-offset-2">
                  /dev/projects/[projectId]/issues
                </Link>
              </li>
              <li>
                <Link href={`/dev/projects/${demoProjectId}/releases`} className="underline underline-offset-2">
                  /dev/projects/[projectId]/releases
                </Link>
              </li>
              <li>
                <Link href={`/dev/projects/${demoProjectId}/settings`} className="underline underline-offset-2">
                  /dev/projects/[projectId]/settings
                </Link>
              </li>
              <li>
                <Link href="/dev/profile" className="underline underline-offset-2">
                  /dev/profile
                </Link>
              </li>
            </ul>
          </article>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href={`/p/${demoProjectId}/submit-report`}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Submit a report
          </Link>
        </div>
      </div>
    </main>
  );
}

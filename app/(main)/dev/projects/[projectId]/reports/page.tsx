import { RoutePlaceholder } from "@/components/common/route-placeholder";

type ReportsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectReportsPage({ params }: ReportsPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/dev/projects/${projectId}/reports`}
      scope="Private"
      title={`Project Reports · ${projectId}`}
      purpose="View all incoming reports."
      actions={[
        "See list of reports",
        "Search reports",
        "Filter reports",
        "Sort reports",
        "Open report",
        "Convert to issue",
        "Merge into existing issue",
        "Run bulk actions",
      ]}
      links={[
        { href: `/dev/projects/${projectId}/overview`, label: "Overview" },
        { href: `/dev/projects/${projectId}/issues`, label: "Issues" },
        { href: `/dev/projects/${projectId}/releases`, label: "Releases" },
        { href: `/dev/projects/${projectId}/settings`, label: "Settings" },
      ]}
    />
  );
}

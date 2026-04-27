import { RoutePlaceholder } from "@/components/common/route-placeholder";

type OverviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectOverviewPage({ params }: OverviewPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/dev/projects/${projectId}/overview`}
      scope="Private"
      title={`Project Overview · ${projectId}`}
      purpose="Central hub of a project."
      actions={[
        "Navigate to Overview, Reports, Issues, Releases, and Settings",
        "See project details",
        "See roadmap summary",
        "See project analytics",
      ]}
      sections={["Overview", "Reports", "Issues", "Releases", "Settings"]}
      links={[
        { href: `/dev/projects/${projectId}/reports`, label: "Reports" },
        { href: `/dev/projects/${projectId}/issues`, label: "Issues" },
        { href: `/dev/projects/${projectId}/releases`, label: "Releases" },
        { href: `/dev/projects/${projectId}/settings`, label: "Settings" },
        { href: `/p/${projectId}/roadmap`, label: "Public roadmap" },
        { href: `/p/${projectId}/releases`, label: "Public releases" },
      ]}
    />
  );
}

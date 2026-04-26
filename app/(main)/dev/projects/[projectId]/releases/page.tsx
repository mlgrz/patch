import { RoutePlaceholder } from "@/components/common/route-placeholder";

type ReleasesPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectReleasesPage({ params }: ReleasesPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/dev/projects/${projectId}/releases`}
      scope="Private"
      title={`Project Releases · ${projectId}`}
      purpose="Manage all versions and release shipping."
      actions={[
        "See list of versions",
        "Create new version",
        "Select issues to ship in a version",
        "Release version",
        "See version changelog",
      ]}
      links={[
        { href: `/dev/projects/${projectId}/overview`, label: "Overview" },
        { href: `/dev/projects/${projectId}/reports`, label: "Reports" },
        { href: `/dev/projects/${projectId}/issues`, label: "Issues" },
        { href: `/dev/projects/${projectId}/settings`, label: "Settings" },
        { href: `/p/${projectId}/releases`, label: "Public releases" },
      ]}
    />
  );
}

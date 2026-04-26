import { RoutePlaceholder } from "@/components/common/route-placeholder";

type IssuesPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectIssuesPage({ params }: IssuesPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/dev/projects/${projectId}/issues`}
      scope="Private"
      title={`Project Issues · ${projectId}`}
      purpose="Manage all issues as the main working unit."
      actions={[
        "See list of issues",
        "Search issues",
        "Filter issues",
        "Sort issues",
        "Create new issue",
        "Open issue",
        "Run bulk actions",
      ]}
      links={[
        { href: `/dev/projects/${projectId}/overview`, label: "Overview" },
        { href: `/dev/projects/${projectId}/reports`, label: "Reports" },
        { href: `/dev/projects/${projectId}/releases`, label: "Releases" },
        { href: `/dev/projects/${projectId}/settings`, label: "Settings" },
      ]}
    />
  );
}

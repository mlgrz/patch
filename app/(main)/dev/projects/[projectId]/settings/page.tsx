import { RoutePlaceholder } from "@/components/common/route-placeholder";

type SettingsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectSettingsPage({ params }: SettingsPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/dev/projects/${projectId}/settings`}
      scope="Private"
      title={`Project Settings · ${projectId}`}
      purpose="Edit and manage project settings."
      actions={["Edit project", "Delete project"]}
      links={[
        { href: `/dev/projects/${projectId}/overview`, label: "Overview" },
        { href: `/dev/projects/${projectId}/reports`, label: "Reports" },
        { href: `/dev/projects/${projectId}/issues`, label: "Issues" },
        { href: `/dev/projects/${projectId}/releases`, label: "Releases" },
      ]}
    />
  );
}

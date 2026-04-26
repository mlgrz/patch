import { RoutePlaceholder } from "@/components/common/route-placeholder";

type ReleasesPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function PublicReleasesPage({ params }: ReleasesPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/p/${projectId}/releases`}
      scope="Public"
      title={`Public Releases · ${projectId}`}
      purpose="Show all release history."
      actions={["See all released versions", "Open a version and review its changelog"]}
      links={[
        { href: `/p/${projectId}/submit-report`, label: "Submit report" },
        { href: `/p/${projectId}/roadmap`, label: "Public roadmap" },
        { href: "/login", label: "Developer login" },
      ]}
    />
  );
}

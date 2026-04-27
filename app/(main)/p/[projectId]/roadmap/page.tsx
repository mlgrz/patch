import { RoutePlaceholder } from "@/components/common/route-placeholder";

type RoadmapPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function PublicRoadmapPage({ params }: RoadmapPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/p/${projectId}/roadmap`}
      scope="Public"
      title={`Public Roadmap · ${projectId}`}
      purpose="Show what is being worked on."
      sections={["Planned", "In Progress", "Done", "Shipped"]}
      links={[
        { href: `/p/${projectId}/submit-report`, label: "Submit report" },
        { href: `/p/${projectId}/releases`, label: "Public releases" },
        { href: "/login", label: "Developer login" },
      ]}
    />
  );
}

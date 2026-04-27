import { RoutePlaceholder } from "@/components/common/route-placeholder";

type SubmitReportPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function SubmitReportPage({ params }: SubmitReportPageProps) {
  const { projectId } = await params;

  return (
    <RoutePlaceholder
      path={`/p/${projectId}/submit-report`}
      scope="Public"
      title={`Submit Report · ${projectId}`}
      purpose="Main report submission form for end-users."
      actions={["Submit report", "Cancel submission"]}
      links={[
        { href: `/p/${projectId}/roadmap`, label: "Public roadmap" },
        { href: `/p/${projectId}/releases`, label: "Public releases" },
        { href: "/login", label: "Developer login" },
        { href: "/", label: "Landing" },
      ]}
    />
  );
}

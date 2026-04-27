import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function CreateProjectPage() {
  return (
    <RoutePlaceholder
      path="/dev/projects/create-project"
      scope="Private"
      title="Create Project"
      purpose="Initialize a new project."
      actions={[
        "Fill out project details",
        "Create project",
        "Copy shareable link",
        "Copy or download QR code",
      ]}
      links={[
        { href: "/dev/dashboard", label: "Back to dashboard" },
        { href: "/dev/projects/demo-project/overview", label: "Demo project overview" },
        { href: "/p/demo-project/submit-report", label: "Demo public submit link" },
      ]}
    />
  );
}

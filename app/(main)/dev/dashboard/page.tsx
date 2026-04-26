import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function DeveloperDashboardPage() {
  return (
    <RoutePlaceholder
      path="/dev/dashboard"
      scope="Private"
      title="Developer Dashboard"
      purpose="Overview of all projects and activity."
      actions={[
        "Create new project",
        "Open project",
        "Search projects",
        "See ongoing issues from different projects",
        "See recent reports from different projects",
      ]}
      links={[
        { href: "/dev/projects/create-project", label: "Create project" },
        { href: "/dev/projects/demo-project/overview", label: "Open demo project" },
        { href: "/dev/profile", label: "Profile" },
        { href: "/", label: "Public landing" },
      ]}
    />
  );
}

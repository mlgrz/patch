import { redirect } from "next/navigation";

import { getUserProfile } from "@/features/onboarding/services/profile";
import { createClient } from "@/utils/supabase/server";

const ONBOARDING_ROUTE = "/onboarding";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { profile } = await getUserProfile(supabase, user.id);

    if (!profile) {
      redirect(ONBOARDING_ROUTE);
    }
  }

  return children;
}

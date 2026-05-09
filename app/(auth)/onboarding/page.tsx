import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/services/actions";
import { ProfileSetupForm } from "@/features/onboarding/components/profile-setup-form";
import { getUserProfile } from "@/features/onboarding/services/profile";
import { createClient } from "@/utils/supabase/server";

const DASHBOARD_ROUTE = "/dev/dashboard";
const LOGIN_ROUTE = "/login";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
  }

  const { profile } = await getUserProfile(supabase, user.id);

  if (profile) {
    redirect(DASHBOARD_ROUTE);
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_var(--muted)_0,_transparent_36%),linear-gradient(135deg,_var(--background)_0%,_var(--muted)_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-xl items-center">
        <Card className="w-full border-border/70 bg-card/95 shadow-xl shadow-foreground/5 backdrop-blur">
          <CardHeader className="gap-2 p-6">
            <div className="mb-2 w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              One quick step
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Set up your Patch profile
            </CardTitle>
            <CardDescription className="text-sm">
              Add the name teammates will see before entering your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ProfileSetupForm />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-3 border-t border-border/70 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Signed in as {user.email ?? "your current account"}.
            </p>
            <form action={signOut}>
              <Button type="submit" variant="ghost">
                Use a different account
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

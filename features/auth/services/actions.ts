"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const LOGIN_ROUTE = "/login";
const DASHBOARD_ROUTE = "/dev/dashboard";

function redirectWithMessage(message: string): never {
  const search = new URLSearchParams({ message }).toString();
  redirect(`${LOGIN_ROUTE}?${search}`);
}

async function signInWithProvider(provider: "github" | "google") {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const providerLabel = provider === "github" ? "GitHub" : "Google";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${DASHBOARD_ROUTE}`,
    },
  });

  const oauthUrl = data.url;

  if (error || !oauthUrl) {
    redirectWithMessage(error?.message ?? `Unable to start ${providerLabel} sign in.`);
  }

  redirect(oauthUrl);
}

export async function signInWithGitHub() {
  return signInWithProvider("github");
}

export async function signInWithGoogle() {
  return signInWithProvider("google");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

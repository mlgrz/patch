"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getUserProfile } from "@/features/onboarding/services/profile";
import { createClient } from "@/utils/supabase/server";

const DASHBOARD_ROUTE = "/dev/dashboard";
const LOGIN_ROUTE = "/login";

const profileSetupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(80, "Keep your name to 80 characters or fewer."),
});

export type ProfileSetupFormState =
  | {
      errors?: {
        name?: string[];
      };
      message?: string;
    }
  | undefined;

function redirectToLogin(): never {
  const search = new URLSearchParams({
    message: "Please sign in before setting up your profile.",
  }).toString();

  redirect(`${LOGIN_ROUTE}?${search}`);
}

export async function setUpProfile(
  _state: ProfileSetupFormState,
  formData: FormData,
): Promise<ProfileSetupFormState> {
  const parsed = profileSetupSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirectToLogin();
  }

  const { profile, error: profileError } = await getUserProfile(supabase, user.id);

  if (profileError) {
    return {
      message: "We couldn't check your profile yet. Please try again.",
    };
  }

  if (profile) {
    revalidatePath("/", "layout");
    redirect(DASHBOARD_ROUTE);
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    name: parsed.data.name,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      revalidatePath("/", "layout");
      redirect(DASHBOARD_ROUTE);
    }

    return {
      message: "We couldn't save your profile. Please try again.",
    };
  }

  revalidatePath("/", "layout");
  redirect(DASHBOARD_ROUTE);
}

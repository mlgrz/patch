import type { SupabaseClient } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  name: string;
};

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: data as UserProfile | null,
    error,
  };
}

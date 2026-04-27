import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dev/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safePath = next.startsWith("/") ? next : "/";
      return NextResponse.redirect(`${requestUrl.origin}${safePath}`);
    }
  }

  const errorSearch = new URLSearchParams({
    message: "Could not authenticate. Please try again.",
  }).toString();

  return NextResponse.redirect(`${requestUrl.origin}/login?${errorSearch}`);
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { slugify } from "@/lib/utils/slug";

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional().catch(""),
  public_slug: z.string().trim().min(1).transform(slugify),
  public_url: z.string().trim().min(1),
  app_type: z
    .union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)])
    .transform((value) => (Array.isArray(value) ? value.join(",") : value)),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createProjectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { name, description, public_slug, public_url, app_type } = parsed.data;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name,
      description: description || null,
      public_slug,
      public_url,
      app_type,
    })
    .select("id, owner_id, name, description, public_slug, public_url, app_type, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}

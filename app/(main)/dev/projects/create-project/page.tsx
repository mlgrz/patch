"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { slugify } from "@/lib/utils/slug";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: "details", title: "Details" },
  { id: "public", title: "Public link" },
  { id: "type", title: "App type" },
  { id: "review", title: "Review" },
] as const;

type StepId = (typeof steps)[number]["id"];

type FormState = {
  name: string;
  description: string;
  public_slug: string;
  public_url: string;
  app_type: string[];
};

const formSchema = z.object({
  name: z.string().trim().min(1, "Project name is required."),
  description: z.string().trim().optional().catch(""),
  public_slug: z
    .string()
    .trim()
    .min(1, "Public slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes."),
  public_url: z.string().trim().min(1, "Public URL is required."),
  app_type: z.array(z.string().trim().min(1)).min(1, "Select at least one app type."),
});

function getPublicUrlFromSlug(slug: string) {
  if (typeof window === "undefined") return `/p/${slug}/submit-report`;
  return `${window.location.origin}/p/${slug}/submit-report`;
}

function Stepper({ stepIndex }: { stepIndex: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const isActive = index === stepIndex;
        const isDone = index < stepIndex;
        return (
          <li
            key={step.id}
            className={cn(
              "rounded-md border px-3 py-2 text-xs/relaxed",
              isActive && "border-ring ring-2 ring-ring/20",
              isDone && "border-foreground/20",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{step.title}</span>
              <span className="text-muted-foreground">{index + 1}/4</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function CreateProjectPage() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = React.useState(0);
  const stepId = steps[stepIndex]?.id ?? "details";

  const [form, setForm] = React.useState<FormState>(() => ({
    name: "",
    description: "",
    public_slug: "",
    public_url: "",
    app_type: ["web"],
  }));

  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [created, setCreated] = React.useState<null | {
    id: string;
    public_slug: string;
    public_url: string;
    created_at?: string;
  }>(null);

  React.useEffect(() => {
    setForm((prev) => {
      const nextSlug = slugify(prev.name);
      if (!nextSlug) return prev;
      if (prev.public_slug && prev.public_slug !== nextSlug) return prev;
      return {
        ...prev,
        public_slug: nextSlug,
        public_url: getPublicUrlFromSlug(nextSlug),
      };
    });
  }, [form.name]);

  React.useEffect(() => {
    setForm((prev) => {
      if (!prev.public_slug) return prev;
      const nextUrl = getPublicUrlFromSlug(prev.public_slug);
      if (prev.public_url === nextUrl) return prev;
      return { ...prev, public_url: nextUrl };
    });
  }, [form.public_slug]);

  function validateStep(targetStep: StepId) {
    const fieldErrors: Partial<Record<keyof FormState, string>> = {};

    if (targetStep === "details") {
      const result = formSchema.pick({ name: true }).safeParse({ name: form.name });
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof FormState | undefined;
          if (key) fieldErrors[key] = issue.message;
        }
      }
    }

    if (targetStep === "public") {
      const result = formSchema
        .pick({ public_slug: true, public_url: true })
        .safeParse({ public_slug: form.public_slug, public_url: form.public_url });
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof FormState | undefined;
          if (key) fieldErrors[key] = issue.message;
        }
      }
    }

    if (targetStep === "type") {
      const result = formSchema.pick({ app_type: true }).safeParse({ app_type: form.app_type });
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof FormState | undefined;
          if (key) fieldErrors[key] = issue.message;
        }
      }
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function goNext() {
    if (stepId === "details" && !validateStep("details")) return;
    if (stepId === "public" && !validateStep("public")) return;
    if (stepId === "type" && !validateStep("type")) return;
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  async function onCreate() {
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState | undefined;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setCreated(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          typeof payload === "object" && payload && "error" in payload
            ? String((payload as { error?: unknown }).error ?? "Failed to create project.")
            : "Failed to create project.";
        setErrors((prev) => ({ ...prev, name: message }));
        return;
      }

      const createdProject = payload as {
        project: { id: string; public_slug: string; public_url: string; created_at?: string };
      };

      setCreated(createdProject.project);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Create project</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new project and generate a public link for incoming reports.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dev/dashboard")}>
          Back
        </Button>
      </div>

      <Stepper stepIndex={stepIndex} />

      <Card className="p-4">
        {stepId === "details" && (
          <FieldGroup>
            <FieldTitle>Project details</FieldTitle>
            <Field>
              <FieldLabel>Project name</FieldLabel>
              <FieldContent>
                <Input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="e.g. Patch"
                  aria-invalid={!!errors.name}
                />
                <FieldError errors={[errors.name ? { message: errors.name } : undefined]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Optional. What is this project for?"
                />
                <FieldDescription>
                  This is visible only to your team (unless you choose to show it publicly later).
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}

        {stepId === "public" && (
          <FieldGroup>
            <FieldTitle>Public link</FieldTitle>
            <FieldDescription>
              This slug becomes part of your shareable report intake URL.
            </FieldDescription>

            <Field>
              <FieldLabel>Public slug</FieldLabel>
              <FieldContent>
                <Input
                  value={form.public_slug}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, public_slug: slugify(event.target.value) }))
                  }
                  placeholder="e.g. patch"
                  aria-invalid={!!errors.public_slug}
                />
                <FieldError
                  errors={[errors.public_slug ? { message: errors.public_slug } : undefined]}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Public URL</FieldLabel>
              <FieldContent>
                <Input value={form.public_url} readOnly />
                <FieldError
                  errors={[errors.public_url ? { message: errors.public_url } : undefined]}
                />
                <FieldDescription>
                  You can share this with users to submit feedback.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}

        {stepId === "type" && (
          <FieldGroup>
            <FieldTitle>App type</FieldTitle>
            <FieldDescription>Pick the best match. You can change this later.</FieldDescription>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["web", "mobile", "api", "other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setForm((prev) => {
                      const has = prev.app_type.includes(type);
                      if (has) {
                        return { ...prev, app_type: prev.app_type.filter((t) => t !== type) };
                      }
                      return { ...prev, app_type: [...prev.app_type, type] };
                    })
                  }
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-xs/relaxed transition-colors hover:bg-accent",
                    form.app_type.includes(type) && "border-ring ring-2 ring-ring/20",
                  )}
                >
                  <div className="font-medium capitalize">{type}</div>
                  <div className="text-muted-foreground">
                    {type === "web"
                      ? "Browser app"
                      : type === "mobile"
                        ? "iOS/Android"
                        : type === "api"
                          ? "Backend/API"
                          : "Something else"}
                  </div>
                </button>
              ))}
            </div>
            <FieldError errors={[errors.app_type ? { message: errors.app_type } : undefined]} />
          </FieldGroup>
        )}

        {stepId === "review" && (
          <FieldGroup>
            <FieldTitle>Review</FieldTitle>
            <div className="rounded-md border p-3 text-xs/relaxed">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium">{form.name || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">App type</dt>
                  <dd className="font-medium">{form.app_type.length ? form.app_type.join(", ") : "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Description</dt>
                  <dd className="font-medium">{form.description || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Public URL</dt>
                  <dd className="break-all font-medium">{form.public_url || "—"}</dd>
                </div>
              </dl>
            </div>

            {created && (
              <div className="rounded-md border border-foreground/15 bg-foreground/5 p-3 text-xs/relaxed">
                <div className="font-medium">Project created</div>
                <div className="mt-1 text-muted-foreground">{created.public_url}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/dev/projects/${created.public_slug}/overview`)}
                  >
                    Open project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (created.public_url.startsWith("http")) {
                        window.location.assign(created.public_url);
                        return;
                      }
                      router.push(created.public_url);
                    }}
                  >
                    Open public link
                  </Button>
                </div>
              </div>
            )}

            <FieldError errors={[errors.name ? { message: errors.name } : undefined]} />
          </FieldGroup>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="outline" onClick={goBack} disabled={stepIndex === 0 || isSubmitting}>
            Back
          </Button>

          <div className="flex items-center gap-2">
            {stepId !== "review" ? (
              <Button onClick={goNext}>Next</Button>
            ) : (
              <Button onClick={onCreate} disabled={isSubmitting || !!created}>
                {isSubmitting ? "Creating..." : created ? "Created" : "Create project"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

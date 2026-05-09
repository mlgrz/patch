"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  setUpProfile,
  type ProfileSetupFormState,
} from "@/features/onboarding/services/actions";

const initialState: ProfileSetupFormState = undefined;

export function ProfileSetupForm() {
  const [state, action, pending] = useActionState(setUpProfile, initialState);
  const nameErrors = state?.errors?.name?.map((message) => ({ message }));
  const hasNameError = Boolean(state?.errors?.name?.length);

  return (
    <form action={action} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={hasNameError}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Developer"
            required
            maxLength={80}
            aria-invalid={hasNameError}
            disabled={pending}
          />
          <FieldDescription>
            This is the name Patch will show across your projects.
          </FieldDescription>
          <FieldError errors={nameErrors} />
        </Field>

        {state?.message ? <FieldError>{state.message}</FieldError> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </FieldGroup>
    </form>
  );
}

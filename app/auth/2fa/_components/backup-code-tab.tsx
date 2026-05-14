"use client";

import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

const backupCodeSchema = z.object({
  code: z.string().min(1),
});

export default function BackupCodeTab() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: backupCodeSchema,
      onBlur: backupCodeSchema,
      onChange: backupCodeSchema,
    },
    onSubmit: async (value) => {
      await authClient.twoFactor.verifyBackupCode(
        {
          code: value.value.code,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to verify backup code");
          },
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="code"
          children={(field) => {
            return (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>Backup Code</FieldLabel>
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  className="w-full"
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Verifying...
                </>
              ) : (
                "Verify Backup Code"
              )}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  );
}

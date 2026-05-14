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

const totpFormSchema = z.object({
  code: z.string().length(6),
});

export default function TotpForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: totpFormSchema,
      onBlur: totpFormSchema,
      onChange: totpFormSchema,
    },
    onSubmit: async (value) => {
      await authClient.twoFactor.verifyTotp(
        {
          code: value.value.code,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to verify code");
          },
          onSuccess: () => {
            toast.success("Code verified successfully");
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
                <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                <Input
                  type="number"
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
                "Verify Code"
              )}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  );
}

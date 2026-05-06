"use client";

import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data?.currentPassword !== data?.newPassword, {
    message: "Old password and new password cannot be the same",
    path: ["newPassword"],
  });

export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
    validators: {
      onSubmit: changePasswordSchema,
      onBlur: changePasswordSchema,
      onChange: changePasswordSchema,
    },
    onSubmit: async (value) => {
      await authClient.changePassword(
        {
          newPassword: value.value.newPassword,
          currentPassword: value.value.currentPassword,
          revokeOtherSessions: value.value.revokeOtherSessions,
        },
        {
          onError: (error) => {
            toast.error(error.error?.message || "Something went wrong");
          },
          onSuccess: () => {
            toast.success("Password changed successfully");
          },
        },
      );
    },
  });
  return (
    <form
      id="change-password-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="currentPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                <Input
                  type="password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="newPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="revokeOtherSessions"
          children={(field) => {
            return (
              <Field
                className="flex gap-2 flex-row items-center"
                orientation="horizontal"
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  className=""
                  onCheckedChange={(checked) =>
                    field.handleChange(checked ? true : false)
                  }
                />
                <FieldLabel htmlFor={field.name}>
                  Revoke Other Sessions
                </FieldLabel>
              </Field>
            );
          }}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="change-password-form"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  );
}

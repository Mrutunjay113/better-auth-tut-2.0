"use client";
import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import PasskeyButton from "./passkey-button";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInTab({
  openEmailVerificationTab,
  openForgotPasswordTab,
}: {
  openEmailVerificationTab: (email: string) => void;
  openForgotPasswordTab: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async (value) => {
      await authClient.signIn.email(
        {
          email: value.value.email,
          password: value.value.password,
          callbackURL: "/",
        },
        {
          onError: (error) => {
            toast.error(error.error?.message || "Something went wrong");
            if (error.error?.code === "EMAIL_NOT_VERIFIED") {
              openEmailVerificationTab(value.value.email);
            }
          },
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
        },
      );
    },
  });
  return (
    <Card className=" ring-0 w-full my-0 py-0 shadow-none">
      <CardHeader className="">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="">
        <form
          id="sign-in-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="mb-6  ">
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      autoComplete="email webauthn"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="example@example.com"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex justify-between items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={openForgotPasswordTab}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="current-password webauthn"
                        placeholder="********"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />{" "}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <div className="flex  md:flex-row flex-col gap-2">
                  <Button
                    type="submit"
                    form="sign-in-form"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner /> Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              )}
            />
            <PasskeyButton />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

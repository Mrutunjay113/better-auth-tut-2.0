import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
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
import { toast } from "sonner";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1),
});

export default function ForgotPasswordTab({
  openSignInTab,
}: {
  openSignInTab: () => void;
}) {
  console.log("Forgot Password Tab");
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
      onBlur: forgotPasswordSchema,
      onChange: forgotPasswordSchema,
    },
    onSubmit: async (value) => {
      const res = await authClient.requestPasswordReset(
        {
          email: value.value.email,
          redirectTo: "/auth/reset-password",
        },
        {
          onError: (error) => {
            toast.error(error.error?.message || "Something went wrong");
          },
          onSuccess: () => {
            toast.success("Password reset email sent");
          },
        },
      );
    },
  });

  return (
    <Card className="relative ring-0 w-full my-0 py-0">
      <CardHeader className="">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Forgot your password? No problem. Enter your email and we'll send you
          a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <form
          id="forgot-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                return (
                  <Field
                    data-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  >
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                    />
                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex  md:flex-row flex-col relative  gap-2 my-8">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={openSignInTab}
              >
                Back to Sign In
              </Button>
              <Button
                type="submit"
                form="forgot-password-form"
                className="w-1/2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner /> Sending reset email...
                  </>
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}

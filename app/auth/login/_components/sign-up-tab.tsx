"use client";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { authClient } from "@/components/auth/auth-client";
import { useRouter } from "next/navigation";
import EmailVerificationTab from "./email-verification";

const signUpSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(1),

    confirmPassword: z.string().min(1),
    favoriteNumber: z.number().min(1),
  })
  .refine((data) => data?.password === data?.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupSchema = z.infer<typeof signUpSchema>;

export default function SignUpTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    // defaultValues: {
    //   name: "test",
    //   email: "test@test.com",
    //   password: "Test@123",
    //   confirmPassword: "Test@123",
    // },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      favoriteNumber: undefined as unknown as number,
    },
    validators: {
      onSubmit: signUpSchema,
      onBlur: signUpSchema,
      onChange: signUpSchema,
    },
    onSubmit: async (props: { value: SignupSchema }) => {
      const res = await authClient.signUp.email(
        {
          email: props.value.email,
          password: props.value.password,
          name: props.value.name,
          favoriteNumber: props.value.favoriteNumber,
          callbackURL: "/",
        },
        {
          onError: (error) => {
            toast.error(error.error?.message || "Something went wrong");
          },
          onSuccess: () => {
            toast.success("Account created successfully", {
              description: "Please check your email for verification",
            });
          },
        },
      );
      if (res.error === null && !res.data?.user?.emailVerified) {
        openEmailVerificationTab(res?.data?.user?.email);
      } else {
        router.push("/");
      }
    },
  });

  return (
    <Card className=" ring-0 w-full my-0 py-0">
      <CardHeader className="">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started.</CardDescription>
      </CardHeader>
      <CardContent className="">
        {/* <div className="text-xs max-h-28 overflow-auto rounded-md bg-muted/50 p-2 mb-4">
          {JSON.stringify(form.state)}
        </div> */}
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="John Doe"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
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
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="********"
                        minLength={8}
                        maxLength={100}
                        aria-invalid={isInvalid}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        //dont submit the form when the button is clicked
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </Button>
                    </div>

                    {/* <FieldDescription>
                      At least 8 characters, 1 uppercase letter, 1 lowercase
                      letter, 1 number, and 1 special character.
                    </FieldDescription> */}
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="********"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="favoriteNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Favorite Number
                    </FieldLabel>
                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
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
            <div className="flex  md:flex-row flex-col gap-2 my-8">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/2"
                disabled={isSubmitting}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                form="sign-up-form"
                className="w-full sm:w-1/2 justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner /> Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}

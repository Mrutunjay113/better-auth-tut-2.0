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
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import QRCode from "react-qr-code";

const TwoFactorAuthSchema = z.object({
  password: z.string().min(1),
});

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export default function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: TwoFactorAuthSchema,
      onBlur: TwoFactorAuthSchema,
      onChange: TwoFactorAuthSchema,
    },
    onSubmit: async (value) => {
      if (isEnabled) {
        await handleDisbaleTwoFactorAuth(value.value);
      } else {
        await handleEnableTwoFactorAuth(value.value);
      }
      form.reset();
    },
  });

  async function handleDisbaleTwoFactorAuth(
    data: z.infer<typeof TwoFactorAuthSchema>,
  ) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error?.message || "Something went wrong");
        },
        onSuccess: () => {
          toast.success("Two-Factor Authentication disabled successfully");
          router.refresh();
        },
      },
    );
  }
  async function handleEnableTwoFactorAuth(
    data: z.infer<typeof TwoFactorAuthSchema>,
  ) {
    const result = await authClient.twoFactor.enable({
      password: data.password,
    });
    if (result.error) {
      toast.error(result.error.message || "Something went wrong");
    } else {
      setTwoFactorData({
        totpURI: result.data.totpURI,
        backupCodes: result.data.backupCodes,
      });
      toast.success("Two-Factor Authentication enabled successfully");
      router.refresh();
    }
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              variant={isEnabled ? "destructive" : "default"}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                </>
              ) : isEnabled ? (
                "Disable 2FA"
              ) : (
                "Enable 2FA"
              )}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  );
}

const QRCodeVerifySchema = z.object({
  token: z.string().length(6),
});

type QRCodeVerifyData = z.infer<typeof QRCodeVerifySchema>;

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      token: "",
    },
    validators: {
      onSubmit: QRCodeVerifySchema,
      onBlur: QRCodeVerifySchema,
      onChange: QRCodeVerifySchema,
    },
    onSubmit: async (value) => {
      await authClient.twoFactor.verifyTotp(
        {
          code: value.value.token,
          trustDevice: true,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to verify code");
          },
          onSuccess: () => {
            setSuccessfullyEnabled(true);
            toast.success("Code verified successfully");
            router.refresh();
          },
        },
      );
    },
  });

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Verify your device</h1>
        <p className="text-sm text-muted-foreground">
          Scan the QR code below with your authenticator app to verify your
          device.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full"
      >
        <FieldGroup>
          <form.Field
            name="token"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? "Submitting..." : "Submit Code"}
              </Button>
            )}
          />
        </FieldGroup>
      </form>{" "}
      <div className="p-4 bg-background  w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}

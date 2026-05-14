"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Passkey } from "@better-auth/passkey";
import { useForm } from "@tanstack/react-form";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const passkeySchema = z.object({
  code: z.string().min(1),
});

type PasskeyForm = z.infer<typeof passkeySchema>;

export default function PasskeyManagement({
  passkeys,
}: {
  passkeys: Passkey[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: passkeySchema,
      onBlur: passkeySchema,
      onChange: passkeySchema,
    },
    onSubmit: async (value) => {
      handleAddPasskey(value.value);
      form.reset();
      setIsDialogOpen(false);
    },
  });

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(
      { name: data.code },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to add passkey");
        },
        onSuccess: () => {
          router.refresh();
          setIsDialogOpen(false);
        },
      },
    );
  }
  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      { onSuccess: () => router.refresh() },
    );
  }
  return (
    <div className="space-y-6">
      {passkeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No passkeys yet</CardTitle>
            <CardDescription>
              Add your first passkey for secure, passwordless authentication.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {passkeys.map((passkey) => (
            <Card key={passkey.id}>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{passkey.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(passkey.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <BetterAuthActionButton
                  requireAreYouSure
                  type="button"
                  variant="destructive"
                  size="icon"
                  action={() => handleDeletePasskey(passkey.id)}
                >
                  <Trash2 />
                </BetterAuthActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          if (o) form.reset();
          setIsDialogOpen(o);
        }}
      >
        <DialogTrigger asChild>
          <Button>New Passkey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for secure, passwordless authentication.
            </DialogDescription>
          </DialogHeader>
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
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Code</FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
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
                    {isSubmitting ? <Spinner /> : "Add Passkey"}
                  </Button>
                )}
              />
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

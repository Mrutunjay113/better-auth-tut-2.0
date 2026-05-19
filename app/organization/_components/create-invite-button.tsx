"use client";
import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createInviteSchema = z.object({
  email: z.email().trim(),
  role: z.enum(["owner", "admin", "member"]),
});

type CreateInviteSchema = z.infer<typeof createInviteSchema>;

export default function CreateInviteButton() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      role: "member",
    },
    validators: {
      onSubmit: createInviteSchema,
      onBlur: createInviteSchema,
      onChange: createInviteSchema,
    },
    onSubmit: async (value) => {
      await authClient.organization.inviteMember(
        {
          email: value.value.email,
          role: value.value.role as "owner" | "admin" | "member",
        },
        {
          onError: (error) => {
            toast.error(error.error?.message ?? "Something went wrong");
          },
          onSuccess: () => {
            toast.success("Invite created successfully");
            setOpen(false);
            form.reset();
          },
        },
      );
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={"lg"} className="w-fit" onClick={() => setOpen(true)}>
          Create Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invite</DialogTitle>
          <DialogDescription>
            Create a new invite to join your organization.
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
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
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
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="owner">Owner</SelectItem> */}
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <DialogFooter>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    className="w-full md:w-1/2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner /> Inviting...
                      </>
                    ) : (
                      "Invite"
                    )}
                  </Button>
                )}
              />
              <DialogClose asChild>
                <Button variant={"outline"} className="w-full md:w-1/2">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

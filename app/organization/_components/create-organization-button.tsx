"use client";
import { authClient } from "@/components/auth/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1),
});

type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

export default function CreateOrganizationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: createOrganizationSchema,
      onBlur: createOrganizationSchema,
      onChange: createOrganizationSchema,
    },
    onSubmit: async (value) => {
      console.log(value.value);
      await handleCreateOrganization(value.value);
    },
  });

  async function handleCreateOrganization(data: CreateOrganizationSchema) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });
    if (res.error) {
      toast.error(res.error.message ?? "Something went wrong");
    }
    if (res.data) {
      toast.success("Organization created successfully", {
        description: "You can now start managing your organization",
      });
      setIsOpen(false);
      form.reset();
      await authClient.organization.setActive({
        organizationId: res.data?.id,
      });
    }
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={"lg"} className="w-fit" onClick={() => setIsOpen(true)}>
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to manage your team and projects.
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
                    />
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
                        <Spinner /> Creating...
                      </>
                    ) : (
                      "Create Organization"
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

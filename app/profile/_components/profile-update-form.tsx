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
import { useForm } from "@tanstack/react-form";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  favoriteNumber: z.number().min(1),
  // image: z.string().min(1),
});

export default function ProfileUpdateForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    favoriteNumber: number;
    // image: string;
  };
}) {
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      favoriteNumber: user.favoriteNumber,
      // image: user.image,
    },
    validators: {
      onSubmit: profileUpdateSchema,
      onBlur: profileUpdateSchema,
      onChange: profileUpdateSchema,
    },
    onSubmit: async (value) => {
      console.log(value.value);
      const promises = [
        authClient.updateUser({
          name: value.value.name,
          favoriteNumber: value.value.favoriteNumber,
          //check if the session image and the new image are different then upload the new image
          // image:
          //   value.value.image !== user.image ? value.value.image : undefined,
        }),
      ];
      if (value?.value?.email !== user.email) {
        promises.push(
          authClient.changeEmail({
            newEmail: value.value.email,
            callbackURL: "/profile",
          }),
        );
      }
      await Promise.all(promises);

      const res = await Promise.all(promises);
      const updateUserResult = res[0];
      const changeEmailResult = res[1] ?? { error: false };

      if (updateUserResult.error) {
        toast.error(updateUserResult.error.message);
      } else if (changeEmailResult.error) {
        toast.error(changeEmailResult.error.message);
      } else {
        if (value?.value?.email !== user.email) {
          toast.success("verify your new email to complete the update");
        } else {
          toast.success("Profile updated successfully");
        }
        router.refresh();
      }
    },
  });

  // const handleImageUpload = () => {
  //   const file = document.createElement("input");
  //   file.type = "file";
  //   file.accept = "image/*";
  //   file.onchange = (e) => {
  //     const file = (e.target as HTMLInputElement).files?.[0] as File;
  //     if (file) {
  //       setImage(file);
  //       form.setFieldValue("image", file.name);
  //     }
  //   };
  //   file.click();
  // };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {/* Image upload */}
        <div className="flex items-center gap-2">
          {/* <Image
            src={image ? URL.createObjectURL(image) : user.image || ""}
            alt="User Image"
            width={100}
            height={100}
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => {
              handleImageUpload();
            }}
          >
            <Upload />
          </Button> */}
        </div>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
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
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel htmlFor={field.name}>Favorite Number</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                  type="number"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />{" "}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  );
}

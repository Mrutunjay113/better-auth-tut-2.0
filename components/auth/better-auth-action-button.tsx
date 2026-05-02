"use client";
import { ComponentProps } from "react";
import { ActionButton } from "../ui/action-button";

/** Loose enough for better-auth/client actions (OAuth redirect payload, JWT response, errors, …). */
type BetterAuthActionResult = {
  error?: { message?: string | null } | null;
} & Record<string, unknown>;

export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<BetterAuthActionResult>;
  successMessage?: string;
}) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();
        if (res.error) {
          return {
            error: true,
            message: res.error.message ?? "Something went wrong",
          };
        }
        return { error: false, message: successMessage ?? "Action successful" };
      }}
    />
  );
}

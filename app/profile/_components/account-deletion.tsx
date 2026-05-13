"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Trash2 } from "lucide-react";

export default function AccountDeletion() {
  return (
    <BetterAuthActionButton
      variant="destructive"
      requireAreYouSure
      className="w-full"
      successMessage="Account deletion initiated. Please check your email for Confirmation."
      action={() => {
        return authClient.deleteUser({ callbackURL: "/" });
      }}
    >
      <Trash2 />
      Delete Account
    </BetterAuthActionButton>
  );
}

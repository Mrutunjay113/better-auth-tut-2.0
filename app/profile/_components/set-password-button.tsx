"use client";

import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";

export default function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      action={() => {
        return authClient.requestPasswordReset({
          email: email,
          redirectTo: "/auth/reset-password",
        });
      }}
    >
      Send Password reset Email
    </BetterAuthActionButton>
  );
}

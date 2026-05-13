"use client";
import { Button } from "./ui/button";
import { authClient } from "./auth/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { BetterAuthActionButton } from "./auth/better-auth-action-button";

export default function SignOut() {
  const router = useRouter();
  return (
    <BetterAuthActionButton
      variant="destructive"
      action={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/login"); // redirect to login page
            },
          },
        })
      }
    >
      <LogOut className="size-4" />
      Logout
    </BetterAuthActionButton>
  );
}

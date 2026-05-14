"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { KeyIcon, UserKey } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess: () => {
          refetch();
          router.push("/");
        },
      },
    );
  }, [refetch, router]);

  return (
    <BetterAuthActionButton
      variant="outline"
      className="w-full"
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            refetch();
            toast.success("Signed in successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Failed to sign in with passkey",
            );
          },
        })
      }
    >
      <UserKey className="size-4" />
      Sign in with Passkey
    </BetterAuthActionButton>
  );
}

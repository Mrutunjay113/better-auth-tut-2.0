"use client";
import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { UserX } from "lucide-react";

export default function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();
  console.log("session", session);
  if (session?.session?.impersonatedBy == null) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <BetterAuthActionButton
        variant={"destructive"}
        action={() => {
          return authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin");
              refetch();
            },
          });
        }}
        size={"icon"}
      >
        <UserX className="size-4" />
      </BetterAuthActionButton>
    </div>
  );
}

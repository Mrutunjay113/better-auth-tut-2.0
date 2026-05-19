"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { router } from "better-auth/api";
import { Invitation } from "better-auth/plugins";
import { useRouter } from "next/navigation";

export default function InviteInformation({
  invitation,
}: {
  invitation: Invitation;
}) {
  const router = useRouter();
  return (
    <div className="flex gap-4">
      <BetterAuthActionButton
        className=""
        action={() => {
          return authClient.organization.acceptInvitation(
            {
              invitationId: invitation.id,
            },
            {
              onSuccess: async () => {
                await authClient.organization.setActive({
                  organizationId: invitation.organizationId,
                });
                router.push(`/organization`);
              },
            },
          );
        }}
      >
        Accept Invitation
      </BetterAuthActionButton>
      <BetterAuthActionButton
        className=""
        variant={"destructive"}
        action={() => {
          return authClient.organization.rejectInvitation(
            {
              invitationId: invitation.id,
            },
            {
              onSuccess: () => {
                router.push(`/`);
              },
            },
          );
        }}
      >
        Reject Invitation
      </BetterAuthActionButton>
    </div>
  );
}

import { auth } from "@/components/auth/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrganizationSelect from "../../_components/organizaiton-select";
import CreateOrganizationButton from "../../_components/create-organization-button";
import OrganizationTabs from "../../_components/organizaion-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InviteInformation from "./_components/invite-information";

export default async function InvitePage({
  params,
}: PageProps<"/organization/invites/[id]">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session == null) return redirect("/auth/login");
  const { id } = await params;

  const invitation = await auth?.api
    ?.getInvitation({
      headers: await headers(),
      query: {
        id,
      },
    })
    .catch(() => redirect("/"));
  return (
    <div className="container mx-auto my-6 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the organization. Please click the
            button below to accept/reject the invitation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}

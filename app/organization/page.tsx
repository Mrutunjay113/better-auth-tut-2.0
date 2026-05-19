import { auth } from "@/components/auth/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import OrganizationSelect from "./_components/organizaiton-select";
import CreateOrganizationButton from "./_components/create-organization-button";
import OrganizationTabs from "./_components/organizaion-tabs";

export default async function OrganizationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session == null) return redirect("/auth/login");
  return (
    <div className="container mx-auto my-6 px-4">
      <Link href="/" className="inline-flex items-center my-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </Link>
      <div className="flex flex-row gap-4">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>
      <OrganizationTabs />
    </div>
  );
}

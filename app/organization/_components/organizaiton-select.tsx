"use client";

import { authClient } from "@/components/auth/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  if (organizations == null || organizations.length === 0)
    return (
      <div className="text-sm text-muted-foreground">
        No organizations found
      </div>
    );

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: (error) => {
          toast.error(error.error?.message ?? "Something went wrong");
        },
      },
    );
  }

  return (
    <div className="">
      <Select
        value={activeOrganization?.id}
        onValueChange={setActiveOrganization}
      >
        <SelectTrigger className="min-w-[200px]">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

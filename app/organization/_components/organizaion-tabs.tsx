"use client";
import { authClient } from "@/components/auth/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembersTab from "./members-tab";
import InvitesTab from "./invites-tab";

export default function OrganizationTabs() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  if (activeOrganization == null) return null;
  return (
    <Tabs defaultValue="members" className="space-y-4 mt-4">
      <TabsList>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
      </TabsList>
      <Card>
        <CardContent>
          <TabsContent value="members">{<MembersTab />} </TabsContent>
          <TabsContent value="invitations">
            <InvitesTab />
          </TabsContent>
          <TabsContent value="subscription">
            {/* <SubscriptionTab /> */}
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}

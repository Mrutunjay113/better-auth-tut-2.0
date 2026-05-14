import { auth } from "@/components/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TotpForm from "./_components/totp-form";
import BackupCodeTab from "./_components/backup-code-tab";

export default async function TwoFactorAuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session != null) return redirect("/");

  return (
    <div className="my-6 px-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Scan the QR code below with your authenticator app to verify your
            device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList>
              <TabsTrigger value="totp">Authenticator </TabsTrigger>
              <TabsTrigger value="backup-codes">Backup Codes</TabsTrigger>
            </TabsList>
            <TabsContent value="totp">
              <TotpForm />
            </TabsContent>
            <TabsContent value="backup-codes">
              <BackupCodeTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

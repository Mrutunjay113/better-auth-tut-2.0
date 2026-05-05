import { auth } from "@/components/auth/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Key,
  LinkIcon,
  Lock,
  LogOut,
  Trash2,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileUpdateForm from "./_components/profile-update-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session == null) {
    return redirect("/auth/login");
  }
  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      {" "}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              <Badge>{session?.user?.favoriteNumber || "User"}</Badge>
            </div>
            <p className="text-muted-foreground">
              {session?.user?.email || "User"}
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User /> <span className="ml-1">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock /> <span className="ml-1">Security</span>
          </TabsTrigger>
          {/* session */}
          <TabsTrigger value="session">
            <Key /> <span className="ml-1">Session</span>
          </TabsTrigger>
          {/* Accounts */}
          <TabsTrigger value="accounts">
            <LinkIcon /> <span className="ml-1">Accounts</span>
          </TabsTrigger>
          {/* danger */}
          <TabsTrigger value="danger">
            <Trash2 /> <span className="ml-1">Danger</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm
                user={{
                  name: session.user.name || "",
                  email: session.user.email || "",
                  favoriteNumber: session.user.favoriteNumber || 0,
                  image: session.user.image || "",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security"></TabsContent>
      </Tabs>
    </div>
  );
}

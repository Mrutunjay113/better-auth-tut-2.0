import { auth } from "@/components/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserRow from "./_components/user-row";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session == null) return redirect("/auth/login");
  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: { user: ["list"] },
    },
  });
  if (!hasAccess) return redirect("/");

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  });
  const getUsersessionCount = async (userId: string) => {
    const { sessions } = await auth.api.listUserSessions({
      body: {
        userId,
      },
      headers: await headers(),
    });
    return sessions?.length ?? 0;
  };

  return (
    <div className="my-6 px-4 w-full mx-auto">
      <Link href="/" className="inline-flex items-center my-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </Link>
      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Users{" "}
            <strong>({users?.total ?? 0})</strong>
          </CardTitle>
          <CardDescription>
            Manager user accounts, roles, and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. of Active Sessions</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.users.map(async (user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selfId={session.user.id}
                    sessionsCount={await getUsersessionCount(user.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

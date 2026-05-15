"use client";
import { authClient } from "@/components/auth/auth-client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialog,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserWithRole } from "better-auth/plugins";
import {
  CheckCircle,
  MailCheck,
  MailX,
  MoreHorizontal,
  VenetianMask,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function UserRow({
  user,
  selfId,
  sessionsCount,
}: {
  user: UserWithRole;
  selfId: string;
  sessionsCount: number;
}) {
  const { refetch } = authClient.useSession();
  const router = useRouter();
  const isSelf = user.id === selfId;

  const handleImpersonateUser = (userId: string) => {
    authClient.admin.impersonateUser(
      {
        userId,
      },
      {
        onSuccess: () => {
          refetch();
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.error?.message || "Failed to impersonate user");
        },
      },
    );
  };
  const handleRevokeSessions = (userId: string) => {
    authClient.admin.revokeUserSessions(
      {
        userId,
      },
      {
        onSuccess: () => {
          toast.success("Sessions revoked successfully");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to revoke sessions");
        },
      },
    );
  };
  const handleUnbanUser = (userId: string) => {
    authClient.admin.unbanUser(
      {
        userId,
      },
      {
        onSuccess: () => {
          toast.success("User unbanned successfully");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error?.message || "Failed to unban user");
        },
      },
    );
  };
  const handleBanUser = (userId: string) => {
    authClient.admin.banUser(
      {
        userId,
      },
      {
        onSuccess: () => {
          toast.success("User banned successfully");
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to ban user");
        },
      },
    );
  };

  const handleRemoveUser = (userId: string) => {
    authClient.admin.removeUser(
      {
        userId,
      },
      {
        onSuccess: () => {
          toast.success("User removed successfully");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error?.message || "Failed to remove user");
        },
      },
    );
  };

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "Unknown"}</div>
          {/* <div className="text-sm text-muted-foreground">{user.email}</div> */}
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}

            <Badge variant={user?.emailVerified ? "secondary" : "destructive"}>
              {user?.emailVerified ? <MailCheck /> : <MailX />}
              {user?.emailVerified ? "Verified" : "Unverified"}
            </Badge>
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email || "-"}</TableCell>
      <TableCell>{sessionsCount}</TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role || "user"}
        </Badge>
      </TableCell>
      <TableCell>{user.createdAt.toLocaleString()}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  <VenetianMask /> Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                  Revoke Sessions
                </DropdownMenuItem>
                {user?.banned ? (
                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                    Ban User
                  </DropdownMenuItem>
                )}{" "}
                <DropdownMenuSeparator />{" "}
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>{" "}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}

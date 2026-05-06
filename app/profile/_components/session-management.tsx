"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Session } from "better-auth";
import { revokeSession } from "better-auth/api";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();
  console.log(sessions);
  const currentSession = sessions.filter(
    (sessions) => sessions.token === currentSessionToken,
  );
  const otherSessions = sessions.filter(
    (sessions) => sessions.token !== currentSessionToken,
  );

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession[0]} isCurrentSession={true} />
      )}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant={"destructive"}
              action={() =>
                authClient.revokeOtherSessions(undefined, {
                  onSuccess: () => {
                    toast.success("Other sessions revoked successfully");
                    router.refresh();
                  },
                  onError: (error) => {
                    toast.error(error.error?.message || "Something went wrong");
                  },
                })
              }
            >
              <Trash2 className="w-4 h-4" /> Revoke other sessions
            </BetterAuthActionButton>
          )}
        </div>

        {otherSessions.length > 0 ? (
          otherSessions.map((session) => (
            <SessionCard
              key={session.token}
              session={session}
              isCurrentSession={false}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No other active sessions
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession: boolean;
}) {
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (!userAgentInfo) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo?.os.name == null) {
      return "Unknown Device";
    }
    if (userAgentInfo.browser.name == null)
      return userAgentInfo?.os.name || "Unknown Device";
    if (userAgentInfo.os.name == null)
      return userAgentInfo?.browser.name || "Unknown Device";
    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <Card
      className={cn(
        "bg-card shadow-none ",
        isCurrentSession && "bg-primary/10 border-primary/20",
      )}
      size="sm"
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          {userAgentInfo?.device.type === "mobile" ? (
            <Smartphone className="w-4 h-4 " />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Created: {formatDate(session.createdAt)}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires: {formatDate(session.expiresAt)}
            </p>
          </div>
        </div>
        {!isCurrentSession && (
          <BetterAuthActionButton
            size={"icon-sm"}
            variant={"destructive"}
            action={() =>
              authClient.revokeSession(
                {
                  token: session.token,
                },
                {
                  onSuccess: () => {
                    toast.success("Session revoked successfully");
                  },
                  onError: (error) => {
                    toast.error(error.error?.message || "Something went wrong");
                  },
                },
              )
            }
          >
            <Trash2 className="w-4 h-4" />
          </BetterAuthActionButton>
        )}
      </CardContent>
    </Card>
  );
}

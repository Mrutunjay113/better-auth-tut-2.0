"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

export default function EmailVerificationTab({ email }: { email: string }) {
  const interval = useRef<NodeJS.Timeout>(undefined);
  const [timeToNextResend, setTimeToNextResend] = useState(30);

  useEffect(() => {
    startEmailVerificationTimer();
  }, []);

  function startEmailVerificationTimer(time = 30) {
    setTimeToNextResend(time);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newTime = t - 1;
        if (newTime <= 0) {
          clearInterval(interval.current);

          return 0;
        }
        return newTime;
      });
    }, 1000);
  }

  return (
    <Card className=" ring-0 w-full my-0 py-0">
      <CardHeader className="">
        <CardTitle>Email Verification Sent</CardTitle>
        <CardDescription>
          We've sent a verification email to <strong>{email}</strong>. Please
          check your inbox and click the link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <BetterAuthActionButton
          className="w-full"
          disabled={timeToNextResend > 0}
          action={() => {
            startEmailVerificationTimer();
            return authClient.sendVerificationEmail({
              email: email,
              callbackURL: "/",
            });
          }}
        >
          {timeToNextResend > 0
            ? `Resend in ${timeToNextResend} seconds`
            : "Resend Email"}
        </BetterAuthActionButton>
      </CardContent>
    </Card>
  );
}

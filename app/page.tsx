"use client";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);
  if (isPending) return <div>Loading...</div>;

  return (
    <div className="my-6 px-4 max-w-3xl mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Welcome{", "}
          <span className="font-mono text-blue-700">
            {session?.user?.name || "Guest"}
          </span>
        </h1>
        {session ? (
          <BetterAuthActionButton
            size={"lg"}
            variant={"destructive"}
            action={() => {
              return authClient.signOut();
            }}
          >
            Logout
          </BetterAuthActionButton>
        ) : (
          <Button asChild size={"lg"}>
            <Link href="/auth/login">Sign in / Sign up</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

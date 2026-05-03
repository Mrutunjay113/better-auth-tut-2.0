"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInTab from "./_components/sign-in-tab";
import SignUpTab from "./_components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import { GitBranch } from "lucide-react";
import SocialAuthButtons from "./_components/SocialAuthButtons";
import { useEffect, useState } from "react";
import { authClient } from "@/components/auth/auth-client";
import { useRouter } from "next/navigation";
import EmailVerificationTab from "./_components/email-verification";
import ForgotPasswordTab from "./_components/forgotPassword";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | undefined>(undefined);

  const [selectedTab, setSelectedTab] = useState<Tab>("signin" as const);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/");
    });
  }, [router]);

  return (
    <div className="flex justify-start">
      <Tabs
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as Tab)}
        className=" my-6 sm:max-w-xl w-full  px-4"
      >
        {(selectedTab === "signin" || selectedTab === "signup") && (
          <TabsList>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
        )}
        <Card className="w-full ">
          <TabsContent value="signin">
            <SignInTab
              openEmailVerificationTab={openEmailVerificationTab}
              openForgotPasswordTab={() =>
                setSelectedTab("forgot-password" as Tab)
              }
            />
            {/* //add horizontal border with center text "Or" in the middle */}
            <div className="relative mx-7">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center  text-sm uppercase">
                <span className="px-4   text-muted-foreground bg-card">Or</span>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-2 mt-8 w-fit mx-auto">
              <SocialAuthButtons />
            </div>
          </TabsContent>
          <TabsContent value="signup" className="">
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </TabsContent>

          <TabsContent value="email-verification">
            <EmailVerificationTab email={email || "hello@example.com"} />
          </TabsContent>

          <TabsContent value="forgot-password">
            <ForgotPasswordTab openSignInTab={() => setSelectedTab("signin")} />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}

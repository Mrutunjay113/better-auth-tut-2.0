"use client";

import { auth } from "@/components/auth/auth";
import { authClient } from "@/components/auth/auth-client";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
  SupportedOAuthProviders,
} from "@/lib/o-auth-provider";
import { Plus, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3>Linked Accounts</h3>
        {/* if currentAccounts is empty, show a message */}
        {currentAccounts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No linked accounts found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* if currentAccounts is not empty, show the accounts */}
            {currentAccounts?.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                provider={account.providerId}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {/* if currentAccounts is not empty, show the message */}
        <h3 className="text-lg font-medium">Link Other Accounts</h3>
      </div>
      <div className="grid gap-3">
        {SUPPORTED_OAUTH_PROVIDERS?.filter(
          (provider) =>
            !currentAccounts?.find(
              (account) => account.providerId === provider,
            ),
        ).map((provider) => (
          <AccountCard
            key={provider}
            provider={provider}
            account={null as unknown as Account}
          />
        ))}
      </div>
    </div>
  );
}

export function AccountCard({
  account,
  provider,
}: {
  account: Account;
  provider: string;
}) {
  const router = useRouter();
  const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[
    provider as SupportedOAuthProviders
  ] ?? {
    name: provider,
    Icon: Shield,
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {<providerDetails.Icon className="size-5" />}
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier
                  sign-in.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <BetterAuthActionButton
              variant="outline"
              action={() => {
                return authClient.linkSocial(
                  {
                    provider: provider,
                    callbackURL: "/profile",
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                      toast.success("Account linked successfully");
                    },
                    onError: (error) => {
                      toast.error(
                        error.error?.message ?? "Something went wrong",
                      );
                    },
                  },
                );
              }}
            >
              <Plus />
              Link
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant="destructive"
              action={() =>
                authClient.unlinkAccount(
                  {
                    accountId: account.accountId,
                    providerId: provider,
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                      toast.success("Account unlinked successfully");
                    },
                    onError: (error) => {
                      toast.error(
                        error.error?.message ?? "Something went wrong",
                      );
                    },
                  },
                )
              }
            >
              <Trash2 />
              Unlink
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

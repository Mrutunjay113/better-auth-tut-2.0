import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
  ],
});

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "../db/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";
import { sendEmailVerificationEmail } from "@/lib/email/email-verification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "@/app/auth/login/_components/welcome-email";
import { sendDeleteAccountConfirmationEmail } from "@/lib/email/delete-account-confirmation";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey";
import { admin } from "better-auth/plugins";
import { ac, adminRole, user } from "./permission";
export const auth = betterAuth({
  experimental: { joins: true },

  //database configuration
  database: mongodbAdapter(db, {
    client: client,
  }),
  //session configuration
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 60 * 5, // 5 minutes
  //   },
  // },

  //rate limiting configuration
  // rateLimit: {
  //   storage: "database",
  //   enabled: true,
  //   max: 10,
  //   window: 60 * 1000, // 1 minute
  // },

  //social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => ({
        favoriteNumber: Number(profile?.name?.length) || 0,
      }),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: (profile) => ({
        favoriteNumber: Number(profile?.public_repos) || 0,
      }),
    },
  },

  //email and password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        user: { email: user.email, name: user.name },
        url,
      });
    },
  },

  //email verification configuration
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({
        user: { email: user.email, name: user.name },
        url,
      });
    },
  },

  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountConfirmationEmail({
          user: { email: user.email, name: user.name },
          url,
        });
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    additionalFields: {
      favoriteNumber: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ??
          ctx.context.session?.user ?? {
            name: ctx.body.name,
            email: ctx.body.email,
          };
        if (user != null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    admin({
      defaultRole: "user",
      ac: ac,
      roles: {
        admin: adminRole,
        user,
      },
    }),
  ],
});

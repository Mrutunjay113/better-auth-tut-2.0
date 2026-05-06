import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "../db/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";
import { sendEmailVerificationEmail } from "@/lib/email/email-verification";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "@/app/auth/login/_components/welcome-email";

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
  plugins: [nextCookies()],
});

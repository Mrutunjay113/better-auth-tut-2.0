import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "../db/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  experimental: { joins: true },

  //database configuration
  database: mongodbAdapter(db, {
    client: client,
  }),
  //session configuration
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

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
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  //email and password configuration
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

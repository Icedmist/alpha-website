import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://academy.localhost:3000",
    "https://alphaspark.icedmist.tech",
    "https://academy.alphaspark.icedmist.tech",
  ],
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production", // Only enable in production to avoid localhost cookie rejection
    },
  },
});
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

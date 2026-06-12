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
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".icedmist.tech",
    },
  },
});
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

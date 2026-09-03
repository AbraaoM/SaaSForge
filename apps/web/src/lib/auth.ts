import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

import { getDb } from "@/lib/db";
import { getAuthEnv } from "@/lib/env";
import { sendVerificationEmail } from "@/lib/email";

const env = getAuthEnv();

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: "pg" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => sendVerificationEmail(user.email, url),
  },
  plugins: [organization()],
});
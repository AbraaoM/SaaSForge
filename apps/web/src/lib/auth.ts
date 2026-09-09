import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

import { getDb } from "@/lib/db";
import { getAuthEnv } from "@/lib/env";
import { sendVerificationEmail } from "@/lib/email";
import {
  users,
  sessions,
  accounts,
  verifications,
  organizations,
  members,
  invitations,
} from "@/models/schema";

const env = getAuthEnv();

// Better Auth's drizzle adapter looks up schema entries by its internal model names,
// which don't match this project's pluralized table exports.
const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
  organization: organizations,
  member: members,
  invitation: invitations,
};

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: "pg", schema: authSchema }),
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
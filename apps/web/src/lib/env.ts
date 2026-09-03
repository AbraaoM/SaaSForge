import "server-only";

import { z } from "zod";

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

const billingEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  STRIPE_STARTER_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_PRO_PRICE_ID: z.string().startsWith("price_"),
  ABACATEPAY_API_KEY: z.string().min(1),
  ABACATEPAY_WEBHOOK_SECRET: z.string().min(1),
  ABACATEPAY_STARTER_PRODUCT_ID: z.string().startsWith("prod_"),
  ABACATEPAY_PRO_PRODUCT_ID: z.string().startsWith("prod_"),
});

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_"),
  EMAIL_FROM: z.email(),
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvSchema>;
export type AuthEnvironment = z.infer<typeof authEnvSchema>;
export type BillingEnvironment = z.infer<typeof billingEnvSchema>;
export type EmailEnvironment = z.infer<typeof emailEnvSchema>;

export function getDatabaseEnv(): DatabaseEnvironment {
  return databaseEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
  });
}

export function getAuthEnv(): AuthEnvironment {
  return authEnvSchema.parse({
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  });
}

export function getBillingEnv(): BillingEnvironment {
  return billingEnvSchema.parse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID,
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
    ABACATEPAY_API_KEY: process.env.ABACATEPAY_API_KEY,
    ABACATEPAY_WEBHOOK_SECRET: process.env.ABACATEPAY_WEBHOOK_SECRET,
    ABACATEPAY_STARTER_PRODUCT_ID: process.env.ABACATEPAY_STARTER_PRODUCT_ID,
    ABACATEPAY_PRO_PRODUCT_ID: process.env.ABACATEPAY_PRO_PRODUCT_ID,
  });
}

export function getEmailEnv(): EmailEnvironment {
  return emailEnvSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
  });
}
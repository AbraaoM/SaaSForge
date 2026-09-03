import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { billingPlanSchema, createCheckoutSchema } from "@/models/billing";

vi.mock("server-only", () => ({}));

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_example");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_example");
  vi.stubEnv("STRIPE_STARTER_PRICE_ID", "price_starter");
  vi.stubEnv("STRIPE_PRO_PRICE_ID", "price_pro");
  vi.stubEnv("ABACATEPAY_API_KEY", "test_key");
  vi.stubEnv("ABACATEPAY_WEBHOOK_SECRET", "webhook-secret");
  vi.stubEnv("ABACATEPAY_STARTER_PRODUCT_ID", "prod_starter");
  vi.stubEnv("ABACATEPAY_PRO_PRODUCT_ID", "prod_pro");
});

describe("billing contracts", () => {
  it("accepts only supported provider and plan combinations", () => {
    expect(createCheckoutSchema.parse({ provider: "stripe", plan: "pro" })).toEqual({ provider: "stripe", plan: "pro" });
    expect(() => billingPlanSchema.parse("enterprise")).toThrow();
    expect(() => createCheckoutSchema.parse({ provider: "unknown", plan: "pro" })).toThrow();
  });

  it("rejects tampered AbacatePay webhooks", async () => {
    const rawBody = '{"id":"log_123"}';
    const signature = createHmac("sha256", "webhook-secret").update(rawBody, "utf8").digest("base64");
    const { verifyAbacatePaySignature } = await import("@/lib/abacatepay");

    expect(verifyAbacatePaySignature(rawBody, signature)).toBe(true);
    expect(verifyAbacatePaySignature(`${rawBody}x`, signature)).toBe(false);
    expect(verifyAbacatePaySignature(rawBody, null)).toBe(false);
  });
});
import { z } from "zod";

export const billingPlanSchema = z.enum(["starter", "pro"]);
export const billingProviderSchema = z.enum(["stripe", "abacatepay"]);

export const createCheckoutSchema = z.object({
  plan: billingPlanSchema,
  provider: billingProviderSchema,
});

export type BillingPlan = z.infer<typeof billingPlanSchema>;
export type BillingProvider = z.infer<typeof billingProviderSchema>;
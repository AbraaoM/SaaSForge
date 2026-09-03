import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { getBillingEnv } from "@/lib/env";

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({ id: z.string(), url: z.url() }),
  error: z.null(),
});

export async function createAbacatePaySubscription(input: {
  productId: string;
  organizationId: string;
  plan: string;
  returnUrl: string;
  completionUrl: string;
}) {
  const env = getBillingEnv();
  const response = await fetch("https://api.abacatepay.com/v2/subscriptions/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ABACATEPAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ id: input.productId, quantity: 1 }],
      methods: ["CARD"],
      externalId: crypto.randomUUID(),
      returnUrl: input.returnUrl,
      completionUrl: input.completionUrl,
      metadata: { organizationId: input.organizationId, plan: input.plan },
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível iniciar o checkout.");
  }

  return responseSchema.parse(await response.json()).data;
}

export function verifyAbacatePaySignature(rawBody: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", getBillingEnv().ABACATEPAY_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}
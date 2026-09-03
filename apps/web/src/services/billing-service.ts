import "server-only";

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";

import { createAbacatePaySubscription } from "@/lib/abacatepay";
import { getAuthEnv, getBillingEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import type { BillingPlan, BillingProvider } from "@/models/billing";
import { paymentEvents, subscriptions } from "@/models/schema";
import { OrganizationAccessService } from "@/services/organization-access-service";
import { getDb } from "@/lib/db";

const abacateWebhookSchema = z.object({
  id: z.string(),
  event: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }).passthrough(),
}).passthrough();

function getPlanPrice(plan: BillingPlan) {
  const env = getBillingEnv();
  return plan === "starter" ? env.STRIPE_STARTER_PRICE_ID : env.STRIPE_PRO_PRICE_ID;
}

function getAbacatePayProduct(plan: BillingPlan) {
  const env = getBillingEnv();
  return plan === "starter" ? env.ABACATEPAY_STARTER_PRODUCT_ID : env.ABACATEPAY_PRO_PRODUCT_ID;
}

function toSubscriptionStatus(status: string) {
  if (status === "trialing" || status === "TRIAL") return "trialing";
  if (status === "active" || status === "PAID") return "active";
  if (status === "past_due") return "past_due";
  if (status === "unpaid") return "unpaid";
  return "canceled";
}

export class BillingService {
  static async createCheckout(input: { plan: BillingPlan; provider: BillingProvider }) {
    const access = await OrganizationAccessService.requireActiveOrganization();
    const baseUrl = getAuthEnv().BETTER_AUTH_URL;
    const successUrl = `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/billing`;

    if (input.provider === "stripe") {
      const session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        customer_email: access.email,
        client_reference_id: access.organizationId,
        line_items: [{ price: getPlanPrice(input.plan), quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { organizationId: access.organizationId, plan: input.plan },
        subscription_data: { metadata: { organizationId: access.organizationId, plan: input.plan } },
      });

      if (!session.url) {
        throw new Error("Não foi possível iniciar o checkout.");
      }

      return { url: session.url };
    }

    return createAbacatePaySubscription({
      productId: getAbacatePayProduct(input.plan),
      organizationId: access.organizationId,
      plan: input.plan,
      returnUrl: cancelUrl,
      completionUrl: `${baseUrl}/billing/success`,
    });
  }

  static async handleStripeEvent(event: Stripe.Event) {
    if (!event.type.startsWith("customer.subscription.")) return;

    const subscription = event.data.object as Stripe.Subscription;
    const organizationId = subscription.metadata.organizationId;
    if (!organizationId) return;

    await this.upsertSubscription({
      eventId: event.id,
      provider: "stripe",
      providerSubscriptionId: subscription.id,
      organizationId,
      plan: subscription.metadata.plan ?? "unknown",
      status: toSubscriptionStatus(subscription.status),
      customerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      currentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  static async handleAbacatePayEvent(payload: unknown) {
    const event = abacateWebhookSchema.parse(payload);
    if (!event.event.startsWith("subscription.")) return;

    const organizationId = event.data.metadata?.organizationId;
    if (typeof organizationId !== "string") return;

    await this.upsertSubscription({
      eventId: event.id,
      provider: "abacatepay",
      providerSubscriptionId: event.data.id,
      organizationId,
      plan: typeof event.data.metadata?.plan === "string" ? event.data.metadata.plan : "unknown",
      status: toSubscriptionStatus(event.data.status ?? event.event),
      customerId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: event.event === "subscription.cancelled",
    });
  }

  static async canUseFeature() {
    const { organizationId } = await OrganizationAccessService.requireActiveOrganization();
    const [subscription] = await getDb()
      .select({ status: subscriptions.status })
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))
      .limit(1);

    return subscription?.status === "active" || subscription?.status === "trialing";
  }

  private static async upsertSubscription(input: {
    eventId: string;
    provider: string;
    providerSubscriptionId: string;
    organizationId: string;
    plan: string;
    status: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    customerId: string | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  }) {
    const [event] = await getDb()
      .insert(paymentEvents)
      .values({ id: randomUUID(), provider: input.provider, providerEventId: input.eventId })
      .onConflictDoNothing()
      .returning({ id: paymentEvents.id });
    if (!event) return;

    await getDb()
      .insert(subscriptions)
      .values({
        id: randomUUID(),
        organizationId: input.organizationId,
        provider: input.provider,
        providerSubscriptionId: input.providerSubscriptionId,
        customerId: input.customerId,
        plan: input.plan,
        status: input.status,
        currentPeriodEnd: input.currentPeriodEnd,
        cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      })
      .onConflictDoUpdate({
        target: [subscriptions.provider, subscriptions.providerSubscriptionId],
        set: {
          plan: input.plan,
          status: input.status,
          customerId: input.customerId,
          currentPeriodEnd: input.currentPeriodEnd,
          cancelAtPeriodEnd: input.cancelAtPeriodEnd,
          updatedAt: new Date(),
        },
      });
  }
}
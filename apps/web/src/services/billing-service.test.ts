import type Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDbSelect: vi.fn(),
  getDbInsert: vi.fn(),
  requireActiveOrganization: vi.fn(),
  stripeCheckout: vi.fn(),
  abacatePayCheckout: vi.fn(),
  insertedEvent: vi.fn(),
  updateSubscription: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  getDb: () => ({ select: mocks.getDbSelect, insert: mocks.getDbInsert }),
}));
vi.mock("@/lib/env", () => ({
  getAuthEnv: () => ({ BETTER_AUTH_URL: "https://app.example.com" }),
  getBillingEnv: () => ({
    STRIPE_STARTER_PRICE_ID: "price_starter",
    STRIPE_PRO_PRICE_ID: "price_pro",
    ABACATEPAY_STARTER_PRODUCT_ID: "prod_starter",
    ABACATEPAY_PRO_PRODUCT_ID: "prod_pro",
  }),
}));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { create: mocks.stripeCheckout } } }),
}));
vi.mock("@/lib/abacatepay", () => ({
  createAbacatePaySubscription: mocks.abacatePayCheckout,
}));
vi.mock("@/services/organization-access-service", () => ({
  OrganizationAccessService: { requireActiveOrganization: mocks.requireActiveOrganization },
}));

import { BillingService } from "@/services/billing-service";

describe("BillingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireActiveOrganization.mockResolvedValue({
      organizationId: "org-1",
      userId: "user-1",
      email: "user@example.com",
      role: "owner",
    });
    mocks.stripeCheckout.mockResolvedValue({ url: "https://stripe.example/checkout" });
    mocks.abacatePayCheckout.mockResolvedValue({ url: "https://abacatepay.example/checkout" });

    const selectQuery = { from: vi.fn(), where: vi.fn(), limit: vi.fn() };
    selectQuery.from.mockReturnValue(selectQuery);
    selectQuery.where.mockReturnValue(selectQuery);
    mocks.getDbSelect.mockReturnValue(selectQuery);

    const insertQuery = {
      values: vi.fn(),
      onConflictDoNothing: vi.fn(),
      returning: mocks.insertedEvent,
      onConflictDoUpdate: mocks.updateSubscription,
    };
    insertQuery.values.mockReturnValue(insertQuery);
    insertQuery.onConflictDoNothing.mockReturnValue(insertQuery);
    mocks.getDbInsert.mockReturnValue(insertQuery);
    mocks.insertedEvent.mockResolvedValue([{ id: "event-row-1" }]);
    mocks.updateSubscription.mockResolvedValue([]);
  });

  it("creates a Stripe checkout scoped to the active organization", async () => {
    await expect(BillingService.createCheckout({ provider: "stripe", plan: "pro" })).resolves.toEqual({
      url: "https://stripe.example/checkout",
    });

    expect(mocks.requireActiveOrganization).toHaveBeenCalledOnce();
    expect(mocks.stripeCheckout).toHaveBeenCalledWith(expect.objectContaining({
      mode: "subscription",
      client_reference_id: "org-1",
      line_items: [{ price: "price_pro", quantity: 1 }],
      metadata: { organizationId: "org-1", plan: "pro" },
      subscription_data: { metadata: { organizationId: "org-1", plan: "pro" } },
    }));
  });

  it("creates an AbacatePay checkout using the selected product", async () => {
    await expect(BillingService.createCheckout({ provider: "abacatepay", plan: "starter" })).resolves.toEqual({
      url: "https://abacatepay.example/checkout",
    });

    expect(mocks.abacatePayCheckout).toHaveBeenCalledWith({
      productId: "prod_starter",
      organizationId: "org-1",
      plan: "starter",
      returnUrl: "https://app.example.com/billing",
      completionUrl: "https://app.example.com/billing/success",
    });
  });

  it.each([
    ["active", true],
    ["trialing", true],
    ["past_due", false],
    ["canceled", false],
    ["unpaid", false],
    [undefined, false],
  ])("allows a feature for subscription status %s: %s", async (status, allowed) => {
    const query = {
      from: vi.fn(),
      where: vi.fn(),
      limit: vi.fn().mockResolvedValue(status ? [{ status }] : []),
    };
    query.from.mockReturnValue(query);
    query.where.mockReturnValue(query);
    mocks.getDbSelect.mockReturnValue(query);

    await expect(BillingService.canUseFeature()).resolves.toBe(allowed);
    expect(query.where).toHaveBeenCalledOnce();
  });

  it("stores a verified Stripe subscription event and subscription", async () => {
    const event = {
      id: "evt_1",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_1",
          metadata: { organizationId: "org-1", plan: "pro" },
          status: "active",
          customer: "cus_1",
          items: { data: [{ current_period_end: 1_900_000_000 }] },
          cancel_at_period_end: false,
        },
      },
    } as unknown as Stripe.Event;

    await BillingService.handleStripeEvent(event);

    expect(mocks.getDbInsert).toHaveBeenCalledTimes(2);
    expect(mocks.updateSubscription).toHaveBeenCalledWith(expect.objectContaining({
      set: expect.objectContaining({ plan: "pro", status: "active", customerId: "cus_1" }),
    }));
  });

  it("ignores duplicate billing events", async () => {
    mocks.insertedEvent.mockResolvedValue([]);
    const event = {
      id: "evt_duplicate",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_1",
          metadata: { organizationId: "org-1", plan: "pro" },
          status: "active",
          customer: "cus_1",
          items: { data: [{ current_period_end: 1_900_000_000 }] },
          cancel_at_period_end: false,
        },
      },
    } as unknown as Stripe.Event;

    await BillingService.handleStripeEvent(event);

    expect(mocks.getDbInsert).toHaveBeenCalledOnce();
    expect(mocks.updateSubscription).not.toHaveBeenCalled();
  });

  it("maps AbacatePay subscription events into subscription updates", async () => {
    await BillingService.handleAbacatePayEvent({
      id: "ab_evt_1",
      event: "subscription.completed",
      data: {
        id: "ab_sub_1",
        status: "PAID",
        metadata: { organizationId: "org-1", plan: "starter" },
      },
    });

    expect(mocks.getDbInsert).toHaveBeenCalledTimes(2);
    expect(mocks.updateSubscription).toHaveBeenCalledWith(expect.objectContaining({
      set: expect.objectContaining({
        plan: "starter",
        status: "active",
        cancelAtPeriodEnd: false,
      }),
    }));
  });
});

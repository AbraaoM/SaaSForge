import "server-only";

import Stripe from "stripe";

import { getBillingEnv } from "@/lib/env";

export function getStripe() {
  return new Stripe(getBillingEnv().STRIPE_SECRET_KEY);
}
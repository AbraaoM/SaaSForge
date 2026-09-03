import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });

  try {
    const [{ getStripe }, { getBillingEnv }, { BillingService }] = await Promise.all([
      import("@/lib/stripe"),
      import("@/lib/env"),
      import("@/services/billing-service"),
    ]);
    const event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      getBillingEnv().STRIPE_WEBHOOK_SECRET,
    );
    await BillingService.handleStripeEvent(event);

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 });
  }
}
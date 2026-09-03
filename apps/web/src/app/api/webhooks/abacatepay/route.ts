import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    const [{ verifyAbacatePaySignature }, { BillingService }] = await Promise.all([
      import("@/lib/abacatepay"),
      import("@/services/billing-service"),
    ]);
    if (!verifyAbacatePaySignature(rawBody, request.headers.get("x-webhook-signature"))) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    await BillingService.handleAbacatePayEvent(JSON.parse(rawBody));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 });
  }
}
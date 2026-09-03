import { NextResponse } from "next/server";

import { createCheckoutSchema } from "@/models/billing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = createCheckoutSchema.parse(await request.json());
    const { BillingService } = await import("@/services/billing-service");
    const checkout = await BillingService.createCheckout(input);

    return NextResponse.json(checkout);
  } catch {
    return NextResponse.json({ error: "Não foi possível iniciar o checkout." }, { status: 400 });
  }
}
import { NextResponse } from "next/server";
import type { PlanId } from "@/data/product";
import { createCheckout, isLemonSqueezyConfigured } from "@/lib/lemonsqueezy";
import { checkoutRequestSchema } from "@/lib/validation";

const GENERIC_ERROR = "Something went wrong while opening checkout. Please try again.";

/**
 * POST /api/checkout  { plan: "lifetime" }
 * Creates a Lemon Squeezy checkout server-side (the API key never reaches
 * the browser) and returns { url } for the Lemon.js overlay.
 */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // fall through to validation below
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  if (!isLemonSqueezyConfigured()) {
    console.error(
      "[checkout] Lemon Squeezy is not configured — set LEMON_SQUEEZY_API_KEY, " +
        "LEMON_SQUEEZY_STORE_ID and LEMON_SQUEEZY_VARIANT_LIFETIME."
    );
    return NextResponse.json(
      { error: "Checkout is not available right now. Please try again later." },
      { status: 503 }
    );
  }

  try {
    // safeParse above narrowed plan to the literal "lifetime"; this cast is
    // what carries that proof to createCheckout.
    const url = await createCheckout(parsed.data.plan as PlanId);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[checkout] Failed to create checkout:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
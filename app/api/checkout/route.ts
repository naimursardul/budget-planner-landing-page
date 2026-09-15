import { NextResponse } from "next/server";
import type { PlanId } from "@/data/product";
import { createCheckout, isLemonSqueezyConfigured } from "@/lib/lemonsqueezy";

const GENERIC_ERROR = "Something went wrong while opening checkout. Please try again.";

/**
 * POST /api/checkout  { plan: "lifetime" }
 * Creates a Lemon Squeezy checkout server-side (the API key never reaches
 * the browser) and returns { url } for the Lemon.js overlay.
 */
export async function POST(request: Request) {
  let plan: unknown = null;
  try {
    plan = (await request.json())?.plan;
  } catch {
    // fall through to validation below
  }

  if (plan !== "lifetime") {
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
    // Guard above narrowed the JSON value; cast carries the proof to the call.
    const url = await createCheckout(plan as PlanId);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[checkout] Failed to create checkout:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

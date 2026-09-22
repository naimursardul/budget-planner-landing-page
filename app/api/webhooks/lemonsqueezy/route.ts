import { NextResponse } from "next/server";
import { planForVariant, verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { savePurchase, type PurchaseRecord } from "@/lib/mongodb";

/**
 * POST /api/webhooks/lemonsqueezy
 * Every request is signature-verified before anything is trusted. On a
 * successful order we record the purchase (MongoDB when configured, a
 * server-side log otherwise). No card data is ever stored.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: {
    meta?: {
      event_name?: string;
      custom_data?: { plan?: string };
    };
    data?: {
      id?: string;
      attributes?: {
        order_id?: number;
        customer_id?: number;
        user_email?: string;
        status?: string;
        created_at?: string;
        currency?: string;
        total?: number;
        discount_total?: number;
        first_order_item?: { variant_id?: number };
      };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  if (eventName === "order_created" || eventName === "order_refunded") {
    const attributes = payload.data?.attributes ?? {};
    const customData = payload.meta?.custom_data ?? {};
    const variantId = String(attributes.first_order_item?.variant_id ?? "");
    // Prefer the variant mapping; fall back to the plan we stamped into the
    // checkout's custom data.
    const plan =
      planForVariant(variantId) ??
      (customData.plan === "lifetime" ? "lifetime" : null);

    const record: PurchaseRecord = {
      orderId: String(attributes.order_id ?? payload.data?.id ?? ""),
      customerId: String(attributes.customer_id ?? ""),
      email: String(attributes.user_email ?? ""),
      variantId,
      plan: plan ?? "unknown",
      status: String(attributes.status ?? eventName),
      ...(typeof attributes.total === "number" ? { total: attributes.total } : {}),
      ...(typeof attributes.discount_total === "number"
        ? { discountTotal: attributes.discount_total }
        : {}),
      ...(typeof attributes.currency === "string" ? { currency: attributes.currency } : {}),
      createdAt: attributes.created_at ? new Date(attributes.created_at) : new Date(),
    };

    try {
      await savePurchase(record);
    } catch (error) {
      // Log but still acknowledge — Lemon Squeezy retries on non-2xx, and a
      // storage hiccup shouldn't cause a storm of duplicate events.
      console.error("[webhook] Failed to persist purchase:", error);
    }
  }

  return NextResponse.json({ received: true });
}

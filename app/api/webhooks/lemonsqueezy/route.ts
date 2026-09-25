import { NextResponse } from "next/server";
import { planForVariant, verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { savePurchase } from "@/lib/mongodb";
import {
  lemonsqueezyWebhookSchema,
  toPurchaseInput,
} from "@/lib/validation";
import {
  ORDER_STATUSES,
  type OrderStatus,
  type Plan,
  type PurchaseRecord,
} from "@/models/Purchase";

/**
 * POST /api/webhooks/lemonsqueezy
 * Every request is signature-verified before anything is trusted. On an
 * order event we validate and normalize the payload, then record the
 * purchase (MongoDB when configured, a server-side log otherwise). No card
 * data is ever stored.
 */

/**
 * Assemble the final purchase document from the validated webhook fields,
 * applying the variant→plan mapping and a sensible status fallback. Returns
 * null when a required identifier is missing so the event is skipped
 * instead of persisting garbage.
 */
function buildPurchaseRecord(
  payload: Parameters<typeof toPurchaseInput>[0],
  eventId: string,
): PurchaseRecord | null {
  const input = toPurchaseInput(payload, eventId);

  if (!input.orderId || !input.customerId || !input.variantId || !input.email) {
    return null;
  }

  // Prefer the variant mapping; fall back to the plan we stamped into the
  // checkout's custom data; otherwise mark it unknown rather than dropping.
  const plan: Plan = planForVariant(input.variantId) ?? input.plan ?? "unknown";

  const rawStatus = input.status;
  const status: OrderStatus = (ORDER_STATUSES as readonly string[]).includes(
    rawStatus,
  )
    ? (rawStatus as OrderStatus)
    : rawStatus === "refunded"
      ? "refunded"
      : "unknown";

  return {
    orderId: input.orderId,
    customerId: input.customerId,
    email: input.email,
    variantId: input.variantId,
    plan,
    status,
    ...(input.total !== undefined ? { total: input.total } : {}),
    ...(input.discountTotal !== undefined
      ? { discountTotal: input.discountTotal }
      : {}),
    ...(input.currency ? { currency: input.currency } : {}),
    createdAt: input.createdAt ?? new Date(),
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const payload = lemonsqueezyWebhookSchema.safeParse(json);
  if (!payload.success) {
    console.warn(
      "[webhook] Malformed payload rejected:",
      payload.error.issues,
    );
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const eventName = payload.data.meta?.event_name ?? "";

  // Only order events carry data we persist; acknowledge everything else.
  if (eventName !== "order_created" && eventName !== "order_refunded") {
    return NextResponse.json({ received: true });
  }

  const record = buildPurchaseRecord(payload.data, String(payload.data.data.id));
  if (!record) {
    console.warn(
      `[webhook] ${eventName} event missing required fields — skipped.`,
    );
    return NextResponse.json({ received: true });
  }

  try {
    const result = await savePurchase(record);
    console.log(
      `[webhook] ${eventName} order ${record.orderId} (${record.email}): ${result}`,
    );
  } catch (error) {
    // Log but still acknowledge — Lemon Squeezy retries on non-2xx, and a
    // storage hiccup shouldn't cause a storm of duplicate events.
    console.error("[webhook] Failed to persist purchase:", error);
  }

  return NextResponse.json({ received: true });
}
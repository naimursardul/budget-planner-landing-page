import { NextResponse } from "next/server";
import { planForVariant, verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { savePurchase } from "@/lib/mongodb";
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

type Json = Record<string, unknown>;

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Coerce a numeric or string id from the payload to a trimmed string. */
function toId(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return "";
}

/**
 * Extract and validate everything a purchase document needs. Returns null
 * when a required field is missing or malformed so the caller can skip the
 * event instead of persisting garbage.
 */
function buildPurchaseRecord(
  payload: Json,
  eventName: string,
): PurchaseRecord | null {
  const data = isRecord(payload.data) ? payload.data : null;
  const attributes = data && isRecord(data.attributes) ? data.attributes : null;
  if (!data || !attributes) return null;

  const orderId = toId(attributes.order_id) || toId(data.id);
  const customerId = toId(attributes.customer_id);
  const firstItem = isRecord(attributes.first_order_item)
    ? attributes.first_order_item
    : {};
  const variantId = toId(firstItem.variant_id);
  const email =
    typeof attributes.user_email === "string"
      ? attributes.user_email.trim().toLowerCase()
      : "";

  if (!orderId || !customerId || !variantId || !email) return null;

  const customData =
    isRecord(payload.meta) && isRecord(payload.meta.custom_data)
      ? payload.meta.custom_data
      : {};

  // Prefer the variant mapping; fall back to the plan we stamped into the
  // checkout's custom data; otherwise mark it unknown rather than dropping.
  const plan: Plan =
    planForVariant(variantId) ??
    (customData.plan === "lifetime" ? "lifetime" : "unknown");

  const rawStatus =
    typeof attributes.status === "string" ? attributes.status.toLowerCase() : "";
  const status: OrderStatus = (ORDER_STATUSES as readonly string[]).includes(
    rawStatus,
  )
    ? (rawStatus as OrderStatus)
    : eventName === "order_refunded"
      ? "refunded"
      : "unknown";

  const createdAt =
    typeof attributes.created_at === "string" &&
    !Number.isNaN(Date.parse(attributes.created_at))
      ? new Date(attributes.created_at)
      : new Date();

  return {
    orderId,
    customerId,
    email,
    variantId,
    plan,
    status,
    ...(typeof attributes.total === "number" && attributes.total >= 0
      ? { total: attributes.total }
      : {}),
    ...(typeof attributes.discount_total === "number" &&
    attributes.discount_total >= 0
      ? { discountTotal: attributes.discount_total }
      : {}),
    ...(typeof attributes.currency === "string" && attributes.currency.trim()
      ? { currency: attributes.currency.trim().toUpperCase() }
      : {}),
    createdAt,
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const meta = isRecord(payload.meta) ? payload.meta : {};
  const eventName = typeof meta.event_name === "string" ? meta.event_name : "";

  // Only order events carry data we persist; acknowledge everything else.
  if (eventName !== "order_created" && eventName !== "order_refunded") {
    return NextResponse.json({ received: true });
  }

  const record = buildPurchaseRecord(payload, eventName);
  if (!record) {
    console.warn(
      `[webhook] ${eventName} event missing required fields — skipped.`,
    );
    return NextResponse.json({ received: true });
  }

  try {
    await savePurchase(record);
  } catch (error) {
    // Log but still acknowledge — Lemon Squeezy retries on non-2xx, and a
    // storage hiccup shouldn't cause a storm of duplicate events.
    console.error("[webhook] Failed to persist purchase:", error);
  }

  return NextResponse.json({ received: true });
}

import "server-only";
import { z } from "zod";

/**
 * Shared Zod schemas for API input validation and Lemon Squeezy webhook
 * payload parsing. Keeping these in one module means the routes stay thin
 * and every validation rule lives in exactly one place.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

const email = z
  .email("Please enter a valid email address.")
  .max(254)
  .transform((value) => value.trim().toLowerCase());

/** Lemon Squeezy IDs arrive as numbers or numeric strings. */
const id = z.union([z.number().int().positive(), z.string().trim().min(1)]);

const nonNegativeAmount = z.number().nonnegative();

const currency = z
  .string()
  .trim()
  .length(3)
  .transform((value) => value.toUpperCase());

const isoDate = z.coerce.date();

// ---------------------------------------------------------------------------
// POST /api/checkout  { plan: "lifetime" }
// ---------------------------------------------------------------------------

export const checkoutRequestSchema = z.object({
  plan: z.literal("lifetime"),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// ---------------------------------------------------------------------------
// POST /api/newsletter  { email: string }
// ---------------------------------------------------------------------------

export const newsletterRequestSchema = z.object({
  email,
});

export type NewsletterRequest = z.infer<typeof newsletterRequestSchema>;

// ---------------------------------------------------------------------------
// Lemon Squeezy webhook payload
// ---------------------------------------------------------------------------

const orderAttributesSchema = z.object({
  order_id: id.optional(),
  customer_id: id.optional(),
  user_email: z.string().trim().min(1).optional(),
  status: z.string().optional(),
  total: nonNegativeAmount.optional(),
  discount_total: nonNegativeAmount.optional(),
  currency: currency.optional(),
  created_at: isoDate.optional(),
  first_order_item: z
    .object({
      variant_id: id.optional(),
    })
    .passthrough()
    .optional(),
});

export const lemonsqueezyWebhookSchema = z.object({
  meta: z
    .object({
      event_name: z.string().optional(),
      custom_data: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough()
    .optional(),
  data: z
    .object({
      id: id,
      attributes: orderAttributesSchema.passthrough(),
    })
    .passthrough(),
});

export type LemonSqueezyWebhookPayload = z.infer<
  typeof lemonsqueezyWebhookSchema
>;

/**
 * Convert a parsed webhook payload into the shape the purchase model expects.
 * Validation has already happened upstream; this only maps field names.
 */
export function toPurchaseInput(
  payload: LemonSqueezyWebhookPayload,
  eventId: string,
) {
  const attributes = payload.data.attributes;
  const customData = payload.meta?.custom_data ?? {};

  return {
    orderId: String(attributes.order_id ?? payload.data.id ?? eventId),
    customerId: String(attributes.customer_id ?? ""),
    email: attributes.user_email?.trim().toLowerCase() ?? "",
    variantId: String(attributes.first_order_item?.variant_id ?? ""),
    plan: customData.plan === "lifetime" ? ("lifetime" as const) : undefined,
    status: attributes.status?.toLowerCase() ?? "",
    total: attributes.total,
    discountTotal: attributes.discount_total,
    currency: attributes.currency,
    createdAt: attributes.created_at,
  };
}
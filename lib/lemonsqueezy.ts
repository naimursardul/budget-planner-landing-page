import "server-only";
import crypto from "node:crypto";
import type { PlanId } from "@/data/product";

/**
 * Server-only Lemon Squeezy helpers. The API key lives exclusively on the
 * server — nothing in this module is ever imported by client code.
 */

const API_BASE = "https://api.lemonsqueezy.com/v1";

function env(name: string): string | null {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

export function isLemonSqueezyConfigured(): boolean {
  return Boolean(
    env("LEMON_SQUEEZY_API_KEY") &&
    env("LEMON_SQUEEZY_STORE_ID") &&
    env("LEMON_SQUEEZY_VARIANT_LIFETIME"),
  );
}

function variantForPlan(plan: PlanId): string | null {
  return plan === "lifetime" ? env("LEMON_SQUEEZY_VARIANT_LIFETIME") : null;
}

/** Map a purchased variant ID back to a plan (used by the webhook). */
export function planForVariant(variantId: string): PlanId | null {
  return variantId && variantId === env("LEMON_SQUEEZY_VARIANT_LIFETIME")
    ? "lifetime"
    : null;
}

/**
 * Create a checkout for a plan and return its URL. The checkout is created
 * with embed enabled so Lemon.js can open it as an overlay on the landing page.
 */
export async function createCheckout(plan: PlanId): Promise<string> {
  const apiKey = env("LEMON_SQUEEZY_API_KEY");
  const storeId = env("LEMON_SQUEEZY_STORE_ID");
  const variantId = variantForPlan(plan);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  if (!apiKey || !storeId || !variantId) {
    throw new Error("Lemon Squeezy is not configured");
  }

  const response = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: { embed: true, dark: false },
          checkout_data: {
            // custom round-trips through the webhook's meta.custom_data.
            custom: { plan },
          },
          product_options: {
            redirect_url: `${siteUrl}/?success=true`,
            enabled_variants: [variantId],
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Lemon Squeezy checkout failed (${response.status}): ${detail}`,
    );
  }

  const json = await response.json();
  const url: string | undefined = json?.data?.attributes?.url;
  if (!url) {
    throw new Error("Lemon Squeezy response did not include a checkout URL");
  }
  return url;
}

/**
 * Verify a webhook request's X-Signature header (HMAC-SHA256 of the raw body
 * with the webhook secret, hex-encoded) using a timing-safe comparison.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = env("LEMON_SQUEEZY_WEBHOOK_SECRET");
  if (!secret || !signature) return false;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  const expected = Buffer.from(digest, "utf8");
  const received = Buffer.from(signature, "utf8");
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

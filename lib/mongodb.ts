import "server-only";
import dns from "node:dns/promises";
import mongoose from "mongoose";
import { Purchase, type PurchaseRecord } from "@/models/Purchase";
import { Subscriber } from "@/models/Subscriber";

/**
 * mongodb+srv:// URIs resolve via Node's dns.resolveSrv(), which on some
 * Windows networks hits a resolver that refuses SRV queries (ECONNREFUSED).
 * Pin explicit public DNS servers for resolve* calls. Harmless elsewhere.
 */
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

/**
 * Optional MongoDB persistence. The landing page renders and responds fine
 * without MONGODB_URI — records are simply logged server-side instead.
 */

const URI = process.env.MONGODB_URI?.trim() || null;

const globalForMongoose = globalThis as unknown as {
  __mongooseConnect?: Promise<typeof mongoose>;
};

export function isDatabaseConfigured(): boolean {
  return URI !== null;
}

/** Connect once per process and make sure the unique indexes are built. */
export function dbConnect(): Promise<typeof mongoose> | null {
  if (!URI) return null;
  if (!globalForMongoose.__mongooseConnect) {
    globalForMongoose.__mongooseConnect = mongoose
      .connect(URI)
      .then(async (m) => {
        // Ensure unique indexes exist before we rely on them.
        await Promise.all([Purchase.init(), Subscriber.init()]);
        return m;
      })
      .catch((error) => {
        // Drop the cached rejection so the next request retries the connect.
        console.error("[mongo] Connection failed:", error);
        globalForMongoose.__mongooseConnect = undefined;
        throw error;
      });
  }
  return globalForMongoose.__mongooseConnect;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

/**
 * Persist an order record, upserting by orderId so a later refund event
 * updates the same document instead of duplicating it. No card data, ever.
 */
export async function savePurchase(
  record: PurchaseRecord,
): Promise<"saved" | "skipped"> {
  if (!(await dbConnect())) {
    console.info(
      `[mongo] MONGODB_URI not set — purchase not persisted (order ${record.orderId}, plan ${record.plan})`,
    );
    return "skipped";
  }
  await Purchase.updateOne(
    { orderId: record.orderId },
    { $set: record },
    { upsert: true, setDefaultsOnInsert: true },
  );
  return "saved";
}

/** Store a newsletter subscriber; the unique index rejects duplicates. */
export async function saveSubscriber(
  email: string,
): Promise<"saved" | "duplicate" | "skipped"> {
  if (!(await dbConnect())) {
    console.info(
      `[mongo] MONGODB_URI not set — subscriber not persisted (${email})`,
    );
    return "skipped";
  }
  try {
    await Subscriber.create({ email, createdAt: new Date() });
    return "saved";
  } catch (error) {
    if (isDuplicateKeyError(error)) return "duplicate";
    throw error;
  }
}

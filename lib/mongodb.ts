import "server-only";
import { MongoClient } from "mongodb";

/**
 * Optional MongoDB persistence. The landing page renders and responds fine
 * without MONGODB_URI — records are simply logged server-side instead.
 */

const URI = process.env.MONGODB_URI;

const globalForMongo = globalThis as unknown as {
  __mongoClientPromise?: Promise<MongoClient>;
};

function getClient(): Promise<MongoClient> | null {
  if (!URI) return null;
  if (!globalForMongo.__mongoClientPromise) {
    const client = new MongoClient(URI);
    globalForMongo.__mongoClientPromise = client.connect();
  }
  return globalForMongo.__mongoClientPromise;
}

export type PurchaseRecord = {
  orderId: string;
  customerId: string;
  email: string;
  variantId: string;
  plan: string;
  status: string;
  createdAt: Date;
};

/** Persist an order record (upsert by orderId). No card data, ever. */
export async function savePurchase(record: PurchaseRecord): Promise<"saved" | "skipped"> {
  const client = await getClient();
  if (!client) {
    console.info(
      `[mongo] MONGODB_URI not set — purchase not persisted (order ${record.orderId}, plan ${record.plan})`
    );
    return "skipped";
  }
  await client
    .db()
    .collection<PurchaseRecord>("purchases")
    .updateOne({ orderId: record.orderId }, { $set: record }, { upsert: true });
  return "saved";
}

/** Store a newsletter subscriber; rejects duplicates by email. */
export async function saveSubscriber(
  email: string
): Promise<"saved" | "duplicate" | "skipped"> {
  const client = await getClient();
  if (!client) {
    console.info(`[mongo] MONGODB_URI not set — subscriber not persisted (${email})`);
    return "skipped";
  }
  const exists = await client
    .db()
    .collection<{ email: string }>("subscribers")
    .findOne({ email });
  if (exists) return "duplicate";
  await client
    .db()
    .collection<{ email: string; createdAt: Date }>("subscribers")
    .insertOne({ email, createdAt: new Date() });
  return "saved";
}

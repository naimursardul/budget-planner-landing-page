import "server-only";
import dns from "node:dns/promises";
import mongoose, { Schema } from "mongoose";

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

const URI = process.env.MONGODB_URI;

const globalForMongoose = globalThis as unknown as {
  __mongooseConnect?: Promise<typeof mongoose>;
};

function connect(): Promise<typeof mongoose> | null {
  if (!URI) return null;
  if (!globalForMongoose.__mongooseConnect) {
    globalForMongoose.__mongooseConnect = mongoose
      .connect(URI)
      .then(async (m) => {
        // Make sure unique indexes exist before we rely on them.
        await Promise.all([Purchase.init(), Subscriber.init()]);
        return m;
      })
      .catch((error) => {
        // Drop the cached rejection so the next request retries the connect.
        console.log("error", error);
        globalForMongoose.__mongooseConnect = undefined;
        throw error;
      });
  }
  return globalForMongoose.__mongooseConnect;
}

export type PurchaseRecord = {
  orderId: string;
  customerId: string;
  email: string;
  variantId: string;
  plan: string;
  status: string;
  /** Order amounts as reported by Lemon Squeezy (integer cents). */
  total?: number;
  discountTotal?: number;
  currency?: string;
  createdAt: Date;
};

const purchaseSchema = new Schema<PurchaseRecord>(
  {
    orderId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    email: { type: String, required: true },
    variantId: { type: String, required: true },
    plan: { type: String, required: true },
    status: { type: String, required: true },
    total: Number,
    discountTotal: Number,
    currency: String,
    createdAt: { type: Date, required: true },
  },
  { versionKey: false },
);

const subscriberSchema = new Schema<{ email: string; createdAt: Date }>(
  {
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false },
);

const Purchase =
  mongoose.models.Purchase ??
  mongoose.model<PurchaseRecord>("Purchase", purchaseSchema, "purchases");

const Subscriber =
  mongoose.models.Subscriber ??
  mongoose.model<{ email: string; createdAt: Date }>(
    "Subscriber",
    subscriberSchema,
    "subscribers",
  );

/** Persist an order record (upsert by orderId). No card data, ever. */
export async function savePurchase(
  record: PurchaseRecord,
): Promise<"saved" | "skipped"> {
  if (!(await connect())) {
    console.info(
      `[mongo] MONGODB_URI not set — purchase not persisted (order ${record.orderId}, plan ${record.plan})`,
    );
    return "skipped";
  }
  await Purchase.updateOne(
    { orderId: record.orderId },
    { $set: record },
    { upsert: true },
  );
  return "saved";
}

/** Store a newsletter subscriber; rejects duplicates by email. */
export async function saveSubscriber(
  email: string,
): Promise<"saved" | "duplicate" | "skipped"> {
  if (!(await connect())) {
    console.info(
      `[mongo] MONGODB_URI not set — subscriber not persisted (${email})`,
    );
    return "skipped";
  }
  const exists = await Subscriber.findOne({ email });
  if (exists) return "duplicate";
  await Subscriber.create({ email, createdAt: new Date() });
  return "saved";
}

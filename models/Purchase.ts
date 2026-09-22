import "server-only";
import mongoose, { Schema, type Model, type ValidatorProps } from "mongoose";
import type { PlanId } from "@/data/product";

/**
 * Purchase records written by the Lemon Squeezy webhook. One document per
 * order, upserted by orderId. No payment card data is ever stored.
 */

export type Plan = PlanId | "unknown";

export const PLANS: readonly Plan[] = ["lifetime", "unknown"];

export const ORDER_STATUSES = [
  "paid",
  "pending",
  "failed",
  "refunded",
  "cancelled",
  "unknown",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface PurchaseRecord {
  orderId: string;
  customerId: string;
  email: string;
  variantId: string;
  plan: Plan;
  status: OrderStatus;
  /** Order amounts as reported by Lemon Squeezy (integer cents). */
  total?: number;
  discountTotal?: number;
  currency?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const purchaseSchema = new Schema<PurchaseRecord>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 64,
    },
    customerId: { type: String, required: true, trim: true, maxlength: 64 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      validate: {
        validator: (value: string) => EMAIL_RE.test(value),
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email address`,
      },
    },
    variantId: { type: String, required: true, trim: true, maxlength: 64 },
    plan: { type: String, required: true, enum: PLANS },
    status: {
      type: String,
      required: true,
      enum: ORDER_STATUSES,
      default: "unknown",
    },
    total: { type: Number, min: 0 },
    discountTotal: { type: Number, min: 0 },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    // Set from the Lemon Squeezy order timestamp; immutable so refund
    // updates never rewrite the original purchase date.
    createdAt: { type: Date, required: true, default: Date.now, immutable: true },
  },
  { versionKey: false, timestamps: { createdAt: false } },
);

export const Purchase: Model<PurchaseRecord> =
  mongoose.models.Purchase ??
  mongoose.model<PurchaseRecord>("Purchase", purchaseSchema, "purchases");

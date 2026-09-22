import "server-only";
import mongoose, { Schema, type Model, type ValidatorProps } from "mongoose";
import { isValidEmail } from "@/lib/utils";

export interface SubscriberRecord {
  email: string;
  createdAt: Date;
}

const subscriberSchema = new Schema<SubscriberRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid email address`,
      },
    },
    createdAt: { type: Date, required: true, default: Date.now, immutable: true },
  },
  { versionKey: false },
);

export const Subscriber: Model<SubscriberRecord> =
  mongoose.models.Subscriber ??
  mongoose.model<SubscriberRecord>(
    "Subscriber",
    subscriberSchema,
    "subscribers",
  );

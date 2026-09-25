import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/mongodb";
import { newsletterRequestSchema } from "@/lib/validation";

/**
 * POST /api/newsletter  { email: string }
 * Validates, normalizes and stores the email server-side (MongoDB when
 * configured). Always responds with a user-friendly message.
 */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // fall through to validation below
  }

  const parsed = newsletterRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Please enter a valid email address.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  // The schema already trims and lowercases the email via transform.
  const normalized = parsed.data.email;

  try {
    const result = await saveSubscriber(normalized);
    if (result === "duplicate") {
      return NextResponse.json({
        message: "You're already on the list — welcome back!",
      });
    }
    return NextResponse.json({
      message: "You're in! Look out for budgeting tips in your inbox.",
    });
  } catch (error) {
    console.error("[newsletter] Failed to save subscriber:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
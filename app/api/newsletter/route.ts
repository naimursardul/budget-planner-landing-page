import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/utils";
import { saveSubscriber } from "@/lib/mongodb";

/**
 * POST /api/newsletter  { email: string }
 * Validates, normalizes and stores the email server-side (MongoDB when
 * configured). Always responds with a user-friendly message.
 */
export async function POST(request: Request) {
  let email: unknown = null;
  try {
    email = (await request.json())?.email;
  } catch {
    // fall through to validation below
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  const normalized = email.trim().toLowerCase();

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
      { status: 500 }
    );
  }
}

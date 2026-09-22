"use client";

import { useState } from "react";
import { NEWSLETTER } from "@/data/product";
import Reveal from "./Reveal";

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { message?: string; error?: string } = await response
        .json()
        .catch(() => ({}));

      console.log(response);
      if (response.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're in!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section aria-label="Newsletter" className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush-100 via-blush-50 to-sand px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 size-64 rounded-full bg-white/40 blur-3xl"
            />
            <div className="relative mx-auto max-w-xl">
              <h2 className="heading-lg">{NEWSLETTER.heading}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft/80">
                {NEWSLETTER.text}
              </p>

              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-h-11 flex-1 rounded-full border border-ink/10 bg-white px-5 text-sm text-ink placeholder:text-muted/70 focus:border-rose focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary"
                >
                  {status === "loading" ? "Joining…" : NEWSLETTER.cta}
                </button>
              </form>

              <p
                aria-live="polite"
                className={`mt-4 min-h-5 text-sm ${
                  status === "error" ? "text-rose-dark" : "text-ink-soft/80"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

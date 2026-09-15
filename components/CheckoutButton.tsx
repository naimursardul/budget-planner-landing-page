"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlanId } from "@/data/product";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    LemonSqueezy?: {
      Setup?: () => void;
      Url?: { Open?: (url: string) => void };
    };
  }
}

const GENERIC_ERROR =
  "Something went wrong while opening checkout. Please try again.";

/**
 * Purchase button: asks our server to create a Lemon Squeezy checkout,
 * then opens it as an overlay via Lemon.js. Card details are never
 * touched by this site — Lemon Squeezy handles the entire payment UI.
 */
export default function CheckoutButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: PlanId;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  // Load Lemon.js once, after mount.
  useEffect(() => {
    if (document.getElementById("lemon-squeezy-js")) return;
    const script = document.createElement("script");
    script.id = "lemon-squeezy-js";
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleClick = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data: { url?: string; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.url) {
        setError(data.error ?? GENERIC_ERROR);
        return;
      }

      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Setup?.();
        window.LemonSqueezy.Url.Open(data.url);
      } else {
        // Lemon.js could not load (e.g. blocked) — fall back to full-page checkout.
        window.location.href = data.url;
      }
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }, [plan]);

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className={cn(
          "btn w-full",
          variant === "primary" ? "btn-primary" : "btn-secondary",
          loading && "cursor-wait opacity-70"
        )}
      >
        {loading ? "Opening checkout…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-rose-dark">
          {error}
        </p>
      )}
    </div>
  );
}

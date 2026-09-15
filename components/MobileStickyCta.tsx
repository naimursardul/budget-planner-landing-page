"use client";

import { useEffect, useState } from "react";
import { getPrice } from "@/data/product";
import { cn } from "@/lib/utils";

/**
 * Mobile-only sticky bottom CTA. Slides in once the visitor has scrolled
 * past the hero and hides again while the pricing section is on screen,
 * so it never covers the checkout buttons.
 */
export default function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");

    const onScroll = () => {
      if (!hero) {
        setPastHero(true);
        return;
      }
      setPastHero(window.scrollY > hero.offsetHeight * 0.75);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const pricing = document.getElementById("pricing");
    if (!pricing) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPricingVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(pricing);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !pricingVisible;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/90 backdrop-blur-md transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <p className="min-w-0">
          <span className="block truncate font-serif text-xl leading-tight font-medium text-ink">
            {getPrice()}
            <span className="ml-2 font-sans text-xs font-normal text-muted">
              one-time
            </span>
          </span>
          <span className="block truncate text-[11px] text-muted">
            Instant download • Lifetime access
          </span>
        </p>
        <a href="#pricing" className="btn btn-primary btn-sm shrink-0">
          Get the Planner
        </a>
      </div>
    </div>
  );
}

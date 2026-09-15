"use client";

import { useEffect, useState } from "react";
import { BRAND, NAV_LINKS } from "@/data/product";
import { cn } from "@/lib/utils";
import Icon from "./Icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever a link inside it is used.
  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line bg-cream/85 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="font-serif text-2xl font-semibold tracking-tight text-ink"
          aria-label={`${BRAND.name} — home`}
        >
          {BRAND.name}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted"
            title="All prices are shown in US dollars"
          >
            <Icon name="globe" className="size-3.5" />
            USD
          </span>
          <a href="#pricing" className="btn btn-primary btn-sm">
            Buy Now
          </a>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-cream md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-line/60 py-3.5 text-base font-medium text-ink last:border-b-0"
              >
                {link.label}
              </a>
            ))}
            <a href="#pricing" onClick={closeMenu} className="btn btn-primary mt-4">
              Buy Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

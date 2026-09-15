"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/product";
import { Mockup } from "./mockups";
import Icon from "./Icons";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

export default function ProductGallery() {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight")
        setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length));
      if (event.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length));
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  return (
    <section id="features" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Features"
          heading="A Closer Look Inside"
          subtext="Every part of the planner is designed to be read at a glance — click any view to see it larger."
        />

        {/* mobile: horizontally scrollable cards */}
        <div className="mt-12 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden">
          {GALLERY.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => openLightbox(i)}
              className="card w-[85%] shrink-0 snap-center p-3 text-left"
            >
              <span className="block aspect-[16/10] overflow-hidden rounded-lg">
                <Mockup kind={item.mockup} />
              </span>
              <span className="block px-1 pt-3 pb-1">
                <span className="block font-serif text-lg font-medium text-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {item.text}
                </span>
                <span className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-rose">
                  See details
                  <Icon name="chevron-right" className="size-3.5" />
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* desktop: large viewer + thumbnails */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-[1fr_280px]">
          <button
            type="button"
            onClick={() => openLightbox(selected)}
            className="card group p-4 text-left transition-shadow hover:shadow-lifted"
            aria-label={`Enlarge ${GALLERY[selected].title} view`}
          >
            <span className="block aspect-[16/10] overflow-hidden rounded-lg">
              <Mockup kind={GALLERY[selected].mockup} />
            </span>
            <span className="flex items-start justify-between gap-4 px-1 pt-4 pb-1">
              <span className="min-w-0">
                <span className="block font-serif text-xl font-medium text-ink">
                  {GALLERY[selected].title}
                </span>
                <span className="mt-1 block max-w-md text-sm leading-relaxed text-muted">
                  {GALLERY[selected].text}
                </span>
                <span className="mt-3 grid gap-1.5">
                  {GALLERY[selected].bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-ink-soft"
                    >
                      <Icon name="check" className="mt-0.5 size-3.5 text-rose" />
                      {bullet}
                    </span>
                  ))}
                </span>
              </span>
              <Icon
                name="chevron-right"
                className="mt-1 size-5 shrink-0 text-rose transition-transform group-hover:translate-x-1"
              />
            </span>
          </button>

          <div className="flex flex-col gap-3" role="tablist" aria-label="Planner features">
            {GALLERY.map((item, i) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={i === selected}
                onClick={() => setSelected(i)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all",
                  i === selected
                    ? "border-rose bg-blush-50/60 shadow-soft"
                    : "border-line bg-white hover:border-rose/50"
                )}
              >
                <span className="block w-20 shrink-0 overflow-hidden rounded-md border border-line">
                  <span className="block aspect-[16/10]">
                    <Mockup kind={item.mockup} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">
                    {item.text}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${GALLERY[lightbox].title} — enlarged view`}
          onClick={closeLightbox}
        >
          <div
            className="max-h-full w-full max-w-4xl overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="card p-3 sm:p-4">
              <div className="aspect-[16/10] overflow-hidden rounded-lg">
                <Mockup kind={GALLERY[lightbox].mockup} />
              </div>
              <div className="flex items-start justify-between gap-4 px-1 pt-4 pb-1">
                <div className="min-w-0">
                  <p className="font-serif text-xl font-medium text-ink">
                    {GALLERY[lightbox].title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{GALLERY[lightbox].text}</p>
                  <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {GALLERY[lightbox].bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <Icon name="check" className="mt-0.5 size-3.5 text-rose" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous view"
                    className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-rose"
                    onClick={() =>
                      setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length))
                    }
                  >
                    <Icon name="chevron-left" className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next view"
                    className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-rose"
                    onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length))}
                  >
                    <Icon name="chevron-right" className="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close enlarged view"
              className="mx-auto mt-4 flex size-11 items-center justify-center rounded-full bg-cream/90 text-ink shadow-soft hover:bg-cream"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

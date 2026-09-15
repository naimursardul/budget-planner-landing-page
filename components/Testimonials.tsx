"use client";

import { useRef } from "react";
import { TESTIMONIALS } from "@/data/testimonials";
import Icon from "./Icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const amount = card ? card.clientWidth + 16 : 320;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section aria-label="What customers say" className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Kind Words"
            heading="Made for Real Monthly Budgeting"
            subtext="Sample feedback from early users of the planner."
          />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => scrollByCard(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-rose"
            >
              <Icon name="chevron-left" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => scrollByCard(1)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-rose"
            >
              <Icon name="chevron-right" className="size-4" />
            </button>
          </div>
        </div>

        <Reveal className="mt-12">
          <ul
            ref={trackRef}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0"
            aria-label="Testimonials carousel"
          >
            {TESTIMONIALS.map((testimonial) => (
              <li
                key={testimonial.name}
                className="card flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[45%] lg:w-[31.5%]"
              >
                <div
                  className="flex gap-1 text-rose"
                  aria-label={`Rated ${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Icon key={i} name="star" filled className="size-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-ink-soft italic">
                  “{testimonial.quote}”
                </blockquote>
                <footer className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{testimonial.role}</p>
                </footer>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

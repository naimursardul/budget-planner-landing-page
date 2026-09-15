"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faq";
import Icon from "./Icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-y border-line bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="FAQ" heading="Questions, Answered" />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-line rounded-2xl border border-line bg-white shadow-soft">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-trigger-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-sm font-semibold text-ink sm:text-base">
                        {item.question}
                      </span>
                      <Icon
                        name="chevron-down"
                        className={cn(
                          "size-4 shrink-0 text-rose transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    data-open={isOpen}
                    className="acc-panel"
                  >
                    <div>
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { HOW_IT_WORKS } from "@/data/product";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-line bg-sand py-12 sm:py-16"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="How It Works"
          heading="Start Budgeting in Three Simple Steps"
        />

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {HOW_IT_WORKS.map((step, i) => (
            <li
              key={step.step}
              className="relative md:px-10 md:first:pl-0 md:last:pr-0"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 hidden h-px w-10 bg-line md:block"
                />
              )}
              <Reveal delay={i * 100}>
                <p className="font-serif text-5xl leading-none font-medium text-rose">
                  {step.step}
                </p>
                <h3 className="mt-5 text-sm font-semibold tracking-[0.12em] text-ink uppercase">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

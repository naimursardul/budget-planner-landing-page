import { BENEFITS } from "@/data/product";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Benefits() {
  return (
    <section aria-label="Why this planner" className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why This Planner"
          heading="Built for People Who Want Their Money to Feel Simpler."
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={(i % 3) * 80}>
              <div className="border-t border-line pt-6">
                <h3 className="font-serif text-2xl font-medium text-ink">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { PRICING_PLAN, getPrice } from "@/data/product";
import CheckoutButton from "./CheckoutButton";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Icon from "./Icons";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-y border-line bg-sand py-16 sm:py-20"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Pricing"
          heading="Start Budgeting Smarter Today."
          subtext="One payment. Every feature. Yours for life."
        />

        <Reveal className="mx-auto mt-14 max-w-md">
          <div className="relative flex flex-col rounded-2xl border border-rose bg-white p-7 shadow-lifted sm:p-9">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rose px-4 py-1 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
              Lifetime
            </span>

            <h3 className="text-center text-sm font-semibold tracking-[0.14em] text-muted uppercase">
              {PRICING_PLAN.name}
            </h3>
            <p className="mt-4 flex items-baseline justify-center gap-2">
              <span className="font-serif text-6xl leading-none font-medium text-ink">
                {getPrice()}
              </span>
              <span className="text-sm text-muted">{PRICING_PLAN.cadence}</span>
            </p>

            <ul className="mt-8 flex-1 space-y-2.5 border-t border-line pt-6">
              {PRICING_PLAN.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-ink-soft"
                >
                  <Icon name="check" className="mt-0.5 size-4 text-rose" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CheckoutButton plan={PRICING_PLAN.id} label={PRICING_PLAN.cta} />
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs text-muted">
          Secure checkout via Lemon Squeezy • Instant digital download • PDF
          instructions included
        </p>
      </div>
    </section>
  );
}

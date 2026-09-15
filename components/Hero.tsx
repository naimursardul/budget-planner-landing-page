import { HERO } from "@/data/product";
import LaptopFrame from "./mockups/LaptopFrame";
import DashboardMockup from "./mockups/DashboardMockup";
import Icon from "./Icons";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-sand">
      {/* soft blush wash in the corner */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 -z-0 size-96 rounded-full bg-blush-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 -z-0 size-80 rounded-full bg-blush-50 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <LaptopFrame>
            <DashboardMockup />
          </LaptopFrame>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <p className="eyebrow">{HERO.eyebrow}</p>
          <h1 className="heading-xl mt-4">
            {HERO.heading[0]}
            <span className="mt-1 block italic">{HERO.heading[1]}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {HERO.body}
          </p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {HERO.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <Icon name="check" className="mt-0.5 size-4 text-rose" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={HERO.primaryCtaHref} className="btn btn-primary">
              {HERO.primaryCta}
            </a>
            <a href={HERO.secondaryCtaHref} className="btn btn-secondary">
              {HERO.secondaryCta}
            </a>
          </div>

          <p className="mt-5 text-xs tracking-wide text-muted">{HERO.trustLine}</p>
        </Reveal>
      </div>
    </section>
  );
}

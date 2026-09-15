import { OVERVIEW } from "@/data/product";
import LaptopFrame from "./mockups/LaptopFrame";
import DashboardMockup from "./mockups/DashboardMockup";
import TransactionLogMockup from "./mockups/TransactionLogMockup";
import Icon from "./Icons";
import Reveal from "./Reveal";

export default function ProductOverview() {
  return (
    <section id="overview" className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{OVERVIEW.eyebrow}</p>
          <h2 className="heading-lg mt-3">
            {OVERVIEW.heading[0]}
            <span className="block italic">{OVERVIEW.heading[1]}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">{OVERVIEW.body}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {OVERVIEW.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <Icon name="check" className="mt-0.5 size-4 text-rose" />
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="relative">
          <LaptopFrame>
            <DashboardMockup />
          </LaptopFrame>
          {/* floating detail card */}
          <div className="absolute -right-3 -bottom-10 hidden w-52 overflow-hidden rounded-xl border border-line shadow-lifted sm:block lg:-right-8 lg:w-60">
            <div className="aspect-[4/3]">
              <TransactionLogMockup />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { TRUST_STRIP } from "@/data/product";
import Icon from "./Icons";
import Reveal from "./Reveal";

export default function TrustStrip() {
  return (
    <section aria-label="Product benefits" className="border-y border-line bg-line/60">
      <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
        {TRUST_STRIP.map((item, i) => (
          <div key={item.title} className="bg-cream px-5 py-7 sm:px-6 sm:py-8">
            <Reveal delay={i * 60}>
              <Icon name={item.icon} className="size-6 text-rose" />
              <h3 className="mt-4 text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.text}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

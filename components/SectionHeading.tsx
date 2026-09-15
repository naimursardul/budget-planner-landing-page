import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = "center",
  className,
}: {
  eyebrow?: string;
  heading: string | string[];
  subtext?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const lines = Array.isArray(heading) ? heading : [heading];

  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="heading-lg mt-3">
        {lines.map((line, i) => (
          <span key={i} className={i > 0 ? "block italic text-ink-soft" : undefined}>
            {line}
          </span>
        ))}
      </h2>
      {subtext && <p className="mt-4 text-base leading-relaxed text-muted">{subtext}</p>}
    </Reveal>
  );
}

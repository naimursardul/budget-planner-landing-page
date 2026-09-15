import { cn } from "@/lib/utils";

/**
 * CSS laptop frame that presents a mockup "screenshot" the way a product
 * photo would — bezel, base, soft shadow, and a blush glow behind it.
 */
export default function LaptopFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* soft blush glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-blush-50/80 blur-2xl sm:-inset-6"
      />
      {/* screen */}
      <div className="rounded-t-2xl bg-ink-soft p-1.5 shadow-lifted sm:rounded-t-3xl sm:p-2">
        <div className="aspect-[16/10] overflow-hidden rounded-md bg-white sm:rounded-lg">
          {children}
        </div>
      </div>
      {/* base */}
      <div
        aria-hidden="true"
        className="mx-auto h-1.5 w-[94%] rounded-b-xl bg-gradient-to-b from-[#4a4341] to-ink-soft sm:h-2"
      />
      <div
        aria-hidden="true"
        className="mx-auto h-2 w-[22%] rounded-b-lg bg-[#4a4341] sm:h-2.5"
      />
    </div>
  );
}

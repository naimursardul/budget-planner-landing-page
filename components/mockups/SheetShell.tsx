import { cn } from "@/lib/utils";

const TABS = ["Setup", "Log", "Priority", "Calendar", "Jan", "Feb", "Mar"];

/**
 * Shared spreadsheet chrome (toolbar + sheet-tab strip) wrapped around every
 * mockup so all five "screenshots" feel like the same product.
 */
export default function SheetShell({
  title,
  activeTab,
  children,
  className,
}: {
  title: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-white",
        className
      )}
    >
      {/* toolbar */}
      <div className="flex items-center gap-1.5 border-b border-line bg-sand px-2 py-1 sm:px-3 sm:py-1.5">
        <span className="hidden gap-1 sm:flex" aria-hidden="true">
          <span className="size-1.5 rounded-full bg-blush-200" />
          <span className="size-1.5 rounded-full bg-rose/60" />
          <span className="size-1.5 rounded-full bg-taupe/60" />
        </span>
        <span className="truncate pl-1 text-[7px] font-semibold text-ink sm:text-[9px]">
          {title}
        </span>
        <span className="ml-auto text-[7px] text-muted sm:text-[8px]">100% ▾</span>
      </div>

      <div className="min-h-0 flex-1 p-1.5 sm:p-2.5 lg:p-3">{children}</div>

      {/* sheet tabs */}
      <div
        className="flex gap-0.5 overflow-hidden border-t border-line bg-sand px-1 py-0.5 sm:gap-1 sm:px-1.5"
        aria-hidden="true"
      >
        {TABS.map((tab) => (
          <span
            key={tab}
            className={cn(
              "truncate rounded-t px-1.5 py-0.5 text-[6px] sm:text-[8px]",
              tab === activeTab
                ? "bg-white font-semibold text-ink"
                : "text-muted"
            )}
          >
            {tab}
          </span>
        ))}
        <span className="ml-auto self-center px-1 text-[6px] text-muted sm:text-[8px]">
          Apr ›
        </span>
      </div>
    </div>
  );
}

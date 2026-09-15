import SheetShell from "./SheetShell";

/* Ordered tier list — one-hue ordinal ramp, dark (most important) → light. */
const TIERS = [
  { name: "Essentials", color: "#8e5a6e", items: "Rent · Groceries · Utilities", count: 14, total: "$2,180" },
  { name: "High Priority", color: "#b0778a", items: "Insurance · Savings · Phone", count: 9, total: "$760" },
  { name: "Moderate", color: "#c98f9a", items: "Dining out · Subscriptions", count: 12, total: "$340" },
  { name: "Low Priority", color: "#dba7ae", items: "Hobbies · Shopping", count: 7, total: "$180" },
  { name: "Avoidable", color: "#e8c2c7", items: "Takeout · Impulse buys", count: 5, total: "$95" },
];

export default function PriorityMockup() {
  return (
    <SheetShell title="Priority Tracker" activeTab="Priority">
      <div
        role="img"
        aria-label="Screenshot of the priority tracker listing five spending tiers from Essentials to Avoidable with sample items, item counts and monthly totals"
        className="flex h-full flex-col gap-1 sm:gap-1.5"
      >
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="flex min-h-0 flex-1 items-center gap-1.5 rounded-md border border-line px-1.5 py-1 sm:gap-2.5 sm:rounded-lg sm:px-2.5"
          >
            <span
              className="size-2 shrink-0 rounded-full sm:size-2.5"
              style={{ backgroundColor: tier.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[6px] font-semibold text-ink sm:text-[9px]">
                {tier.name}
              </p>
              <p className="truncate text-[5px] text-muted sm:text-[7px]">{tier.items}</p>
            </div>
            <span className="shrink-0 rounded-full bg-sand px-1.5 py-px text-[5px] text-muted tabular-nums sm:text-[7px]">
              {tier.count} items
            </span>
            <span className="shrink-0 text-[6px] font-semibold text-ink tabular-nums sm:text-[9px]">
              {tier.total}
            </span>
          </div>
        ))}
      </div>
    </SheetShell>
  );
}

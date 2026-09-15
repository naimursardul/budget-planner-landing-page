import SheetShell from "./SheetShell";

/* Single-series "budget vs spent" bars: one hue (brand rose) on a recessive track. */
const BARS = [
  { label: "Housing", spent: 1420, budget: 1600 },
  { label: "Groceries", spent: 386, budget: 520 },
  { label: "Transport", spent: 210, budget: 400 },
  { label: "Dining", spent: 268, budget: 300 },
  { label: "Savings", spent: 500, budget: 500 },
];

/* Validated categorical slots 1–3 (blue, orange, aqua) + muted gray "Other",
   per the dataviz reference palette — adjacent-safe in light mode. */
const DONUT = [
  { label: "Housing", value: 38, color: "#2a78d6" },
  { label: "Food", value: 24, color: "#eb6834" },
  { label: "Transport", value: 18, color: "#1baf7a" },
  { label: "Other", value: 20, color: "#898781" },
];

const R = 36;
const CIRC = 2 * Math.PI * R;
const GAP = 4; // ~2px surface gap between segments at render size

export default function DashboardMockup() {
  let offset = 0;

  return (
    <SheetShell title="January Dashboard" activeTab="Jan">
      <div
        role="img"
        aria-label="Screenshot of a monthly budget dashboard with income, expenses, bills and cash flow tiles, a budget-versus-spent bar list, and a spending breakdown donut chart"
        className="flex h-full flex-col gap-1.5 sm:gap-2"
      >
        {/* KPI tiles */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[
            { label: "Income", value: "$4,250" },
            { label: "Expenses", value: "$2,284" },
            { label: "Bills", value: "$860" },
            { label: "Cash Flow", value: "+$1,106" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-md bg-sand px-1.5 py-1 sm:rounded-lg sm:px-2 sm:py-1.5">
              <p className="truncate text-[6px] text-muted sm:text-[8px]">{kpi.label}</p>
              <p className="truncate text-[7px] font-semibold text-ink tabular-nums sm:text-[10px]">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-5 gap-1.5 sm:gap-2">
          {/* Budget vs. Spent */}
          <div className="col-span-3 flex min-h-0 flex-col rounded-md border border-line p-1.5 sm:rounded-lg sm:p-2.5">
            <p className="mb-1 text-[6px] font-semibold text-ink sm:mb-1.5 sm:text-[9px]">
              Budget vs. Spent
            </p>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-1 sm:gap-1.5">
              {BARS.map((bar) => {
                const pct = Math.min(100, Math.round((bar.spent / bar.budget) * 100));
                return (
                  <div key={bar.label} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-12 shrink-0 truncate text-[6px] text-muted sm:w-14 sm:text-[8px]">
                      {bar.label}
                    </span>
                    <span className="h-1.5 min-w-0 flex-1 rounded-full bg-[#f1ebe6] sm:h-2">
                      <span
                        className="block h-full rounded-r-[3px] bg-rose"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-[6px] text-ink tabular-nums sm:w-12 sm:text-[8px]">
                      ${bar.spent.toLocaleString("en-US")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending breakdown donut */}
          <div className="col-span-2 flex min-h-0 flex-col rounded-md border border-line p-1.5 sm:rounded-lg sm:p-2.5">
            <p className="mb-1 text-[6px] font-semibold text-ink sm:mb-1.5 sm:text-[9px]">
              Spending Breakdown
            </p>
            <div className="flex min-h-0 flex-1 items-center gap-1.5 sm:gap-2.5">
              <div className="relative aspect-square h-full max-h-full shrink-0">
                <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
                  {DONUT.map((seg) => {
                    const len = (seg.value / 100) * CIRC - GAP;
                    const dashOffset = -offset;
                    offset += (seg.value / 100) * CIRC;
                    return (
                      <circle
                        key={seg.label}
                        cx="50"
                        cy="50"
                        r={R}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="13"
                        strokeDasharray={`${Math.max(len, 0)} ${CIRC - Math.max(len, 0)}`}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 50 50)"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[7px] font-semibold text-ink tabular-nums sm:text-[10px]">
                    $2,284
                  </span>
                  <span className="text-[5px] text-muted sm:text-[7px]">spent</span>
                </div>
              </div>
              <ul className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 sm:gap-1">
                {DONUT.map((seg) => (
                  <li key={seg.label} className="flex items-center gap-1 sm:gap-1.5">
                    <span
                      className="size-1.5 shrink-0 rounded-full sm:size-2"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[6px] text-ink sm:text-[8px]">
                      {seg.label}
                    </span>
                    <span className="text-[6px] text-muted tabular-nums sm:text-[8px]">
                      {seg.value}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SheetShell>
  );
}

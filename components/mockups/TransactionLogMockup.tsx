import SheetShell from "./SheetShell";

const COLUMNS = ["Date", "Category", "Sub-category", "Note", "Amount"];

const ROWS = [
  { date: "Jan 31", category: "Income", sub: "Paycheck", note: "Employer", amount: "+$2,125.00" },
  { date: "Jan 30", category: "Housing", sub: "Rent", note: "", amount: "−$1,200.00" },
  { date: "Jan 28", category: "Groceries", sub: "Weekly shop", note: "Market", amount: "−$86.42" },
  { date: "Jan 26", category: "Dining", sub: "Restaurants", note: "Dinner out", amount: "−$42.80" },
  { date: "Jan 24", category: "Transport", sub: "Fuel", note: "", amount: "−$38.00" },
  { date: "Jan 22", category: "Bills", sub: "Phone", note: "Auto-pay", amount: "−$45.00" },
  { date: "Jan 20", category: "Savings", sub: "Emergency fund", note: "Transfer", amount: "−$250.00" },
  { date: "Jan 18", category: "Groceries", sub: "Weekly shop", note: "Market", amount: "−$74.15" },
];

export default function TransactionLogMockup() {
  return (
    <SheetShell title="Transaction Log" activeTab="Log">
      <div
        role="img"
        aria-label="Screenshot of the transaction log table with date, category, sub-category, note and amount columns, using dropdown category selection"
        className="flex h-full flex-col overflow-hidden rounded-md border border-line sm:rounded-lg"
      >
        {/* header */}
        <div className="grid grid-cols-[3rem_1fr_1fr_1fr_auto] gap-1 border-b border-line bg-sand px-1.5 py-1 sm:grid-cols-[3.5rem_1fr_1fr_1fr_auto] sm:px-2.5">
          {COLUMNS.map((col, i) => (
            <span
              key={col}
              className={
                i === COLUMNS.length - 1
                  ? "text-right text-[6px] font-semibold text-muted sm:text-[8px]"
                  : "text-[6px] font-semibold text-muted sm:text-[8px]"
              }
            >
              {col}
            </span>
          ))}
        </div>

        {/* rows */}
        <div className="flex min-h-0 flex-1 flex-col">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[3rem_1fr_1fr_1fr_auto] items-center gap-1 border-b border-line/60 px-1.5 py-1 sm:grid-cols-[3.5rem_1fr_1fr_1fr_auto] sm:px-2.5 ${
                i % 2 === 1 ? "bg-sand/50" : "bg-white"
              }`}
            >
              <span className="text-[6px] text-muted tabular-nums sm:text-[8px]">{row.date}</span>
              {/* dropdown cell */}
              <span className="flex items-center gap-0.5 sm:gap-1">
                <span className="truncate rounded-sm border border-line bg-white px-1 py-px text-[6px] text-ink sm:text-[8px]">
                  {row.category}
                </span>
                <span aria-hidden="true" className="text-[4px] text-muted sm:text-[6px]">
                  ▾
                </span>
              </span>
              <span className="truncate text-[6px] text-muted sm:text-[8px]">{row.sub}</span>
              <span className="truncate text-[6px] text-muted sm:text-[8px]">{row.note}</span>
              <span
                className={`text-right text-[6px] tabular-nums sm:text-[8px] ${
                  row.amount.startsWith("+") ? "font-semibold text-ink" : "text-ink"
                }`}
              >
                {row.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SheetShell>
  );
}

import SheetShell from "./SheetShell";

const CATEGORIES = [
  { name: "Housing", count: 4 },
  { name: "Groceries", count: 6 },
  { name: "Transport", count: 5 },
  { name: "Dining", count: 4 },
  { name: "Bills", count: 8 },
  { name: "Savings", count: 3 },
];

const SWATCHES = ["#e8b6bd", "#c98f9a", "#a8958e", "#6d6561", "#e7ded9"];

export default function SetupMockup() {
  return (
    <SheetShell title="Setup" activeTab="Setup">
      <div
        role="img"
        aria-label="Screenshot of the setup page with currency selection, category list with editable rows, custom sub-category chips and color swatches"
        className="grid h-full grid-cols-5 gap-1.5 sm:gap-2"
      >
        {/* settings panel */}
        <div className="col-span-2 flex min-h-0 flex-col gap-1.5 rounded-md border border-line p-1.5 sm:gap-2 sm:rounded-lg sm:p-2.5">
          <p className="text-[6px] font-semibold text-ink sm:text-[9px]">Settings</p>
          {[
            { label: "Currency", value: "USD — US Dollar" },
            { label: "Start month", value: "January" },
            { label: "Number format", value: "$1,234.56" },
          ].map((field) => (
            <div key={field.label} className="min-w-0">
              <p className="text-[5px] text-muted sm:text-[7px]">{field.label}</p>
              <div className="flex items-center justify-between gap-1 rounded-sm border border-line bg-white px-1 py-0.5 sm:rounded sm:px-1.5">
                <span className="truncate text-[6px] text-ink sm:text-[8px]">{field.value}</span>
                <span aria-hidden="true" className="text-[4px] text-muted sm:text-[6px]">
                  ▾
                </span>
              </div>
            </div>
          ))}
          <div className="mt-auto">
            <p className="mb-0.5 text-[5px] text-muted sm:text-[7px]">Theme colors</p>
            <div className="flex gap-1">
              {SWATCHES.map((color) => (
                <span
                  key={color}
                  className="size-2.5 rounded-full border border-line sm:size-3"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* categories panel */}
        <div className="col-span-3 flex min-h-0 flex-col rounded-md border border-line p-1.5 sm:rounded-lg sm:p-2.5">
          <div className="mb-1 flex items-center justify-between sm:mb-1.5">
            <p className="text-[6px] font-semibold text-ink sm:text-[9px]">Categories</p>
            <span className="rounded-full bg-blush-50 px-1.5 py-px text-[5px] font-medium text-ink sm:text-[7px]">
              + Add
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-px">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex min-w-0 items-center gap-1.5 rounded-sm px-1 py-0.5 sm:gap-2 sm:rounded"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-rose sm:size-2" />
                <span className="min-w-0 flex-1 truncate text-[6px] text-ink sm:text-[8px]">
                  {cat.name}
                </span>
                <span className="text-[5px] text-muted tabular-nums sm:text-[7px]">
                  {cat.count} sub-categories
                </span>
                <span aria-hidden="true" className="text-[5px] text-muted sm:text-[7px]">
                  ✎
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SheetShell>
  );
}

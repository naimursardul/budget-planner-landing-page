import SheetShell from "./SheetShell";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/* March 2026 — the 1st falls on a Sunday, so the grid is a clean 5×7. */
const EVENTS: Record<number, { label: string; paid?: boolean }> = {
  1: { label: "Rent $1,200", paid: true },
  8: { label: "Phone $45" },
  12: { label: "Internet $60" },
  15: { label: "Car $320" },
  22: { label: "Streaming $15" },
};

export default function CalendarMockup() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <SheetShell title="Bill Calendar — March" activeTab="Calendar">
      <div
        role="img"
        aria-label="Screenshot of the bill calendar showing March as a month grid with due dates for rent, phone, internet, car and streaming bills, one marked as paid"
        className="flex h-full flex-col gap-0.5 sm:gap-1"
      >
        <div className="grid grid-cols-7 gap-px sm:gap-0.5">
          {WEEKDAYS.map((d, i) => (
            <span
              key={i}
              className="text-center text-[5px] font-semibold text-muted sm:text-[7px]"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-5 gap-px sm:gap-0.5">
          {days.map((day) => {
            const event = EVENTS[day];
            return (
              <div
                key={day}
                className="flex min-h-0 min-w-0 flex-col gap-px rounded-sm border border-line bg-white p-0.5 sm:rounded sm:p-1"
              >
                <span className="text-[5px] text-muted tabular-nums sm:text-[7px]">{day}</span>
                {event && (
                  <span
                    className={`truncate rounded-sm px-0.5 text-[4px] leading-tight sm:rounded sm:px-1 sm:text-[6px] ${
                      event.paid
                        ? "bg-sand text-muted line-through"
                        : "bg-blush-50 font-medium text-ink"
                    }`}
                  >
                    {event.paid ? `✓ ${event.label}` : event.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SheetShell>
  );
}

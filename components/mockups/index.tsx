import DashboardMockup from "./DashboardMockup";
import TransactionLogMockup from "./TransactionLogMockup";
import PriorityMockup from "./PriorityMockup";
import CalendarMockup from "./CalendarMockup";
import SetupMockup from "./SetupMockup";
import type { MockupKind } from "@/data/product";

const MOCKUPS: Record<MockupKind, React.ComponentType> = {
  dashboard: DashboardMockup,
  transactions: TransactionLogMockup,
  priority: PriorityMockup,
  calendar: CalendarMockup,
  setup: SetupMockup,
};

/** Renders the CSS mockup "screenshot" for a given part of the product. */
export function Mockup({ kind }: { kind: MockupKind }) {
  const Component = MOCKUPS[kind];
  return <Component />;
}

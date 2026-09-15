/**
 * Centralized product content for the landing page.
 * Keep all copy here so components stay presentational.
 */

export type PlanId = "lifetime";

export type MockupKind =
  | "dashboard"
  | "transactions"
  | "priority"
  | "calendar"
  | "setup";

export const BRAND = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Budgetly",
  tagline: "Money, made simple.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
};

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

export const HERO = {
  eyebrow: "The Smarter Way to Budget",
  heading: ["Take Control of Your Money.", "Without the Spreadsheet Stress."],
  body: "Track income, expenses, savings, bills, and spending priorities in one beautiful, easy-to-use Google Sheets budget planner.",
  bullets: [
    "Fully editable Google Sheets template",
    "12 monthly budget dashboards",
    "Automatic calculations & visual charts",
    "Bill calendar & priority tracking",
    "Instant digital access",
    "Cash flow overview",
  ],
  primaryCta: "Get the Budget Planner",
  primaryCtaHref: "#pricing",
  secondaryCta: "See What's Inside",
  secondaryCtaHref: "#features",
  trustLine: "Instant digital download • No subscription required",
};

export type TrustItem = {
  icon: "bolt" | "pencil" | "calculator" | "sheets" | "chart" | "package";
  title: string;
  text: string;
};

export const TRUST_STRIP: TrustItem[] = [
  {
    icon: "bolt",
    title: "Instant Access",
    text: "Download and start budgeting in minutes",
  },
  {
    icon: "pencil",
    title: "Fully Editable",
    text: "Customize categories, colors and currency",
  },
  {
    icon: "calculator",
    title: "Automatic Calculations",
    text: "Let the spreadsheet handle the math",
  },
  {
    icon: "sheets",
    title: "Google Sheets Ready",
    text: "Works directly inside Google Sheets",
  },
  {
    icon: "chart",
    title: "Visual Budgeting",
    text: "Charts make your spending easier to understand",
  },
  {
    icon: "package",
    title: "Digital Product",
    text: "No physical shipping. No waiting.",
  },
];

export const OVERVIEW = {
  eyebrow: "One Organized Workspace",
  heading: ["Everything You Need.", "One Beautiful Budget."],
  body: "Say goodbye to scattered spreadsheets and complicated money tracking. This budget planner brings your monthly finances, spending, bills and savings into one organized workspace.",
  bullets: [
    "Automatic budget tracking",
    "Monthly income & expense planning",
    "Cash flow overview",
    "Bill due-date tracking",
    "Spending priority management",
    "Visual charts & summaries",
  ],
};

export type GalleryItem = {
  title: string;
  text: string;
  bullets: string[];
  mockup: MockupKind;
};

export const GALLERY: GalleryItem[] = [
  {
    title: "Monthly Dashboard",
    text: "Budget vs. spent, earnings overview and spending breakdown for every month.",
    bullets: [
      "Budget vs. spent for every category",
      "Earnings overview and income totals",
      "Spending breakdown by category",
      "Expenses, bills and debt in one view",
      "Cash flow summary for the month",
    ],
    mockup: "dashboard",
  },
  {
    title: "Transaction Log",
    text: "A single, simple log that feeds every calculation in the planner.",
    bullets: [
      "Date, category and sub-category",
      "Dropdown selection — no typing required",
      "Amounts feed every dashboard automatically",
      "One log for the whole year",
    ],
    mockup: "transactions",
  },
  {
    title: "Priority Tracker",
    text: "Tag expenses from Essentials to Avoidable and spend with intention.",
    bullets: [
      "Essentials, High Priority, Moderate",
      "Low Priority and Avoidable tiers",
      "See where your money is really going",
      "Make intentional spending decisions",
    ],
    mockup: "priority",
  },
  {
    title: "Bill Calendar",
    text: "Due dates, recurring payments and notes organized month by month.",
    bullets: [
      "Recurring payments in one place",
      "Due dates laid out on a calendar",
      "Notes for each bill",
      "Check off completed items",
    ],
    mockup: "calendar",
  },
  {
    title: "Setup Page",
    text: "Your currency, your categories, your rules — configured in one place.",
    bullets: [
      "Currency selection",
      "Custom categories and sub-categories",
      "Editable structure throughout",
      "A personalized budgeting system",
    ],
    mockup: "setup",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Get the Template",
    text: "Complete your purchase and receive instant access.",
  },
  {
    step: "02",
    title: "Customize Your Setup",
    text: "Choose your currency, categories and preferences.",
  },
  {
    step: "03",
    title: "Start Budgeting",
    text: "Track spending and let the formulas and dashboards do the work.",
  },
] as const;

export const BENEFITS = [
  {
    title: "Spend With Intention",
    text: "See exactly where your money is going.",
  },
  {
    title: "Plan Ahead",
    text: "Prepare for bills, expenses and savings goals.",
  },
  {
    title: "Understand Your Habits",
    text: "Use visual summaries to identify spending patterns.",
  },
  {
    title: "Stay Consistent",
    text: "Keep every month organized in one place.",
  },
  {
    title: "Reduce Spreadsheet Work",
    text: "Automatic calculations do the repetitive work.",
  },
  {
    title: "Customize Everything",
    text: "Make the planner fit your life.",
  },
] as const;

/**
 * Placeholder price used only when NEXT_PUBLIC_PRICE_LIFETIME is not set.
 * Replace via the environment variable (or here) before going live.
 */
const PRICE_FALLBACK = "$29";

export function getPrice(): string {
  const env = process.env.NEXT_PUBLIC_PRICE_LIFETIME;
  return env && env.trim() ? env.trim() : PRICE_FALLBACK;
}

export type PricingPlan = {
  id: PlanId;
  name: string;
  cadence: string;
  features: string[];
  cta: string;
};

export const PRICING_PLAN: PricingPlan = {
  id: "lifetime",
  name: "Lifetime Access",
  cadence: "One-time payment",
  features: [
    "Full budget planner",
    "12 monthly dashboards",
    "Transaction log",
    "Bill calendar",
    "Priority tracker",
    "PDF instructions",
    "Lifetime access to the purchased version",
  ],
  cta: "Get Instant Access",
};

export const NEWSLETTER = {
  heading: "Build Better Money Habits.",
  text: "Get practical budgeting tips, spreadsheet ideas, and occasional product updates delivered to your inbox.",
  cta: "Join the List",
};

export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Refund Policy", href: "#faq" },
      // Placeholder pages — create app/terms and app/privacy when ready.
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    heading: "Company",
    links: [{ label: "About", href: "#overview" }],
  },
] as const;

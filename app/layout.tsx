import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Trimmed check — some hosts set NEXT_PUBLIC_SITE_URL to an empty string,
// which `??` doesn't catch and `new URL("")` would throw on.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Budgetly";

const title =
  "Budget Planner for Google Sheets | Simple Monthly Budget Template";
const description =
  "Take control of your finances with a beautifully organized Google Sheets budget planner featuring monthly dashboards, expense tracking, bill tracking, priority planning and automatic calculations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brandName,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F9F7F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Analytics />
        <main>{children}</main>
      </body>
    </html>
  );
}

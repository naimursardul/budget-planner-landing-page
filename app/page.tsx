import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ProductGallery from "@/components/ProductGallery";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MobileStickyCta from "@/components/MobileStickyCta";
import { getPrice } from "@/data/product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Budget Spreadsheet for Google Sheets",
  description:
    "A ready-made, fully editable Google Sheets budget template with monthly dashboards, a transaction log, bill calendar, priority tracker, automatic calculations and PDF instructions.",
  brand: {
    "@type": "Brand",
    name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Budgetly",
  },
  offers: {
    "@type": "Offer",
    url: siteUrl,
    priceCurrency: "USD",
    price: getPrice().replace(/[^0-9.]/g, ""),
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, generated from our own data file — no user input involved.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        {/* <ProductOverview /> */}
        <ProductGallery />
        <HowItWorks />
        <Benefits />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}

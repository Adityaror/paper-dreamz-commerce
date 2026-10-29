import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { heroProps, PAGES_CONTENT } from "@/lib/content/pages";
import CustomOrders, { CustomOrderForm } from "@/components/CustomOrders";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Custom Orders | Paper Dreamz by Ruchi Mishra",
  description:
    "Customised handmade envelopes, cash boxes, coin boxes and tags for weddings, baby celebrations, festivals and corporate gifting. Bulk orders welcome, delivered across India.",
  alternates: { canonical: "/custom-orders" },
  openGraph: {
    title: "Custom Orders | Paper Dreamz by Ruchi Mishra",
    description: "Tell us your idea — we'll handcraft it for your celebration.",
    url: "/custom-orders",
    images: [{ url: "/images/hero_emerald_envelope.jpg", alt: "Custom Paper Dreamz envelope" }],
  },
};

export default function CustomOrdersPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero contentKey="custom-orders.hero" {...heroProps(PAGES_CONTENT["custom-orders.hero"])}>
          <a
            href="#enquire"
            className="mt-9 inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-bottle-green px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:bg-emerald-2 hover:border-gold transition-colors"
          >
            Start your order
          </a>
        </PageHero>
        <CustomOrders />
        <Experience />
        <CustomOrderForm />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

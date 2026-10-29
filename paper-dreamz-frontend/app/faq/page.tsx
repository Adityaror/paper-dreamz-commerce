import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { heroProps, PAGES_CONTENT } from "@/lib/content/pages";
import Faq, { FaqContactCta } from "@/components/Faq";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "FAQs | Paper Dreamz by Ruchi Mishra",
  description:
    "Answers on customisation, bulk orders, processing time, payment, delivery across India and returns for Paper Dreamz handmade envelopes and gifting.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "FAQs | Paper Dreamz by Ruchi Mishra", url: "/faq" },
};

export default function FaqPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero contentKey="faq.hero" {...heroProps(PAGES_CONTENT["faq.hero"])} />
        <Faq />
        <FaqContactCta />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

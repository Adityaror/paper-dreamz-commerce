import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { heroProps, PAGES_CONTENT } from "@/lib/content/pages";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Shop | Paper Dreamz by Ruchi Mishra",
  description:
    "Shop handmade luxury envelopes, cash boxes, gold & silver coin boxes, luxury tags and greeting tags by Paper Dreamz — every piece customisable for your celebration.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop | Paper Dreamz by Ruchi Mishra",
    description: "Luxury handmade envelopes, cash boxes, coin boxes and tags for every celebration.",
    url: "/shop",
    images: [{ url: "/images/collection_envelopes.jpg", alt: "Paper Dreamz handmade envelopes" }],
  },
};

export default function ShopPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero contentKey="shop.hero" {...heroProps(PAGES_CONTENT["shop.hero"])} />
        <ShopCatalog />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

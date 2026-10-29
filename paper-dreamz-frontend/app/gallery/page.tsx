import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { heroProps, PAGES_CONTENT } from "@/lib/content/pages";
import GalleryGrid from "@/components/GalleryGrid";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Gallery | Paper Dreamz by Ruchi Mishra",
  description:
    "Browse every handmade Paper Dreamz design — luxury wedding envelopes and more, cut, layered and finished by hand. Tap any piece to see its details and pricing.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Paper Dreamz by Ruchi Mishra",
    description: "Every handmade Paper Dreamz design in one place.",
    url: "/gallery",
    images: [{ url: "/images/products/wedding-envelopes/we0005.webp", alt: "The Royal Elegance handmade wedding envelope" }],
  },
};

export default function GalleryPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero contentKey="gallery.hero" {...heroProps(PAGES_CONTENT["gallery.hero"])} />
        <GalleryGrid />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

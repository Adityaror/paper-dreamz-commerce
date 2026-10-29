import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AboutStory from "@/components/AboutStory";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "About Us | Paper Dreamz by Ruchi Mishra",
  description:
    "Started in Delhi in 2010 with a single punching machine, Paper Dreamz by Ruchi Mishra has grown into a destination for luxury handcrafted envelopes, Shagun Lifafas and keepsakes loved across the world.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story | Paper Dreamz by Ruchi Mishra",
    description: "Every beautiful thing begins with a dream. Ours began with paper.",
    url: "/about",
    images: [{ url: "/images/brand_story_craft.jpg", alt: "Paper Dreamz handcrafted paper art" }],
  },
};

export default function AboutPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1">
        <AboutStory />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

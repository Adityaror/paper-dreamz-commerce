import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { heroProps, PAGES_CONTENT } from "@/lib/content/pages";
import ContactDetails from "@/components/ContactDetails";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Contact Us | Paper Dreamz by Ruchi Mishra",
  description:
    "Contact Paper Dreamz by Ruchi Mishra, New Delhi — WhatsApp +91 76690 06999 for orders, or call +91 99999 80586. Handmade envelopes and gifting delivered across India.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Paper Dreamz by Ruchi Mishra",
    description: "Orders, custom designs and bulk enquiries — we'd love to hear from you.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1 bg-cream">
        <PageHero contentKey="contact.hero" {...heroProps(PAGES_CONTENT["contact.hero"])} />
        <ContactDetails />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

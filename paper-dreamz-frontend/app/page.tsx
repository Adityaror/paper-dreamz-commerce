import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueStrip from "@/components/ValueStrip";
import Collections from "@/components/Collections";
import CraftedWithHeart from "@/components/CraftedWithHeart";
import MissionVision from "@/components/MissionVision";
import WhyChooseUs from "@/components/WhyChooseUs";
import CraftBanner from "@/components/CraftBanner";
import ProcessSteps from "@/components/ProcessSteps";
import Experience from "@/components/Experience";
import NewArrivals from "@/components/NewArrivals";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import PromoPopup from "@/components/PromoPopup";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <Intro />
      <Navbar />
      <main className="flex-1 transition-colors duration-400">
        <Hero />
        <ValueStrip />
        <Collections />
        <CraftedWithHeart />
        <MissionVision />
        <WhyChooseUs />
        <CraftBanner />
        <NewArrivals />
        <Experience />
        <ProcessSteps />
        <Faq />
      </main>
      <Footer />
      <PromoPopup />
    </ThemeProvider>
  );
}


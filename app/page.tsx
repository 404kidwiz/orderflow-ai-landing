"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/smooth-scroll";
import { gsap, ScrollTrigger } from "@/lib/scroll-animations";
import NavBar from "@/components/NavBar/NavBar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import LiveDemo from "@/components/LiveDemo";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import CalendlyModal from "@/components/CalendlyModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    initLenis();

    // Refresh ScrollTrigger after Lenis init
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      destroyLenis();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <main className="relative min-h-screen bg-[var(--void)] overflow-x-hidden">
        <NavBar />
        <Hero />
        <TrustBar />
        <HowItWorks />
        <LiveDemo />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <LeadForm />
        <Footer />
        <CalendlyModal />
      </main>
    </>
  );
}

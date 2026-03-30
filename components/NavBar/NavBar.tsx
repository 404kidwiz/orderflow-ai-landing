"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://enchanting-sable-bd0c5c.netlify.app";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#pricing", label: "Pricing" },
  { href: `${DASHBOARD_URL}/demo`, label: "Dashboard" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] px-6 transition-all duration-300 border-b border-transparent ${
        scrolled ? "bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-[var(--border)]" : ""
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[1280px] mx-auto h-[72px] flex items-center justify-between gap-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline text-[var(--silk)] font-bold text-[20px] tracking-[-0.02em]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="10" width="4" height="8" rx="2" fill="var(--ember)" className="animate-pulse" />
            <rect x="8" y="6" width="4" height="16" rx="2" fill="var(--ember)" className="animate-pulse" style={{ animationDelay: "0.1s" }} />
            <rect x="14" y="8" width="4" height="12" rx="2" fill="var(--ember)" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
            <rect x="20" y="4" width="4" height="20" rx="2" fill="var(--ember)" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
          </svg>
          <span>OrderFlow</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="px-4 py-2 text-[var(--ash)] no-underline text-[15px] font-medium rounded-lg transition-colors duration-200 hover:text-[var(--silk)] hover:bg-white/5">
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+17705255393" className="flex items-center gap-1.5 px-3.5 py-2 text-[var(--ash)] no-underline text-[14px] font-medium rounded-lg transition-colors duration-200 hover:text-[var(--silk)]">
            <Phone size={16} />
            <span className="hidden lg:inline">+1 (770) 525-5393</span>
          </a>
          <a href="#book-demo" className="px-5 py-2.5 bg-transparent text-[var(--silk)] no-underline text-[14px] font-semibold rounded-lg border border-white/20 transition-all duration-200 whitespace-nowrap hover:border-[var(--ember)] hover:text-[var(--ember)] hover:bg-[var(--ember)]/5">
            Book a Demo
          </a>
          <a href="#lead-form" className="px-5 py-2.5 bg-[linear-gradient(135deg,var(--ember)_0%,var(--ember-glow)_100%)] text-white no-underline text-[14px] font-semibold rounded-lg transition-all duration-200 shadow-[0_4px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,69,0,0.4)]">
            Start Free Trial
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex md:hidden bg-none border-none text-[var(--silk)] cursor-pointer p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-[72px] left-0 right-0 bg-[rgba(10,10,15,0.97)] backdrop-blur-xl border-b border-[var(--border)] p-6 flex flex-col gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="p-4 text-[var(--silk)] no-underline text-[18px] font-medium rounded-xl transition-colors duration-200 hover:bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#lead-form"
              className="mt-3 p-4 bg-[linear-gradient(135deg,var(--ember)_0%,var(--ember-glow)_100%)] text-white no-underline text-[16px] font-semibold rounded-xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
              onClick={() => setMobileOpen(false)}
            >
              Start Free Trial
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

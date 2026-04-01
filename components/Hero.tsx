"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { Phone, CheckCircle2, Clock } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load 3D component for performance
const HeroPhone3D = dynamic(() => import("./HeroPhone3D"), {
  ssr: false,
  loading: () => null,
});

// ── Terminal mockup — updated with OrderFlow real data ──
function TerminalMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto lg:mx-0"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15, 21, 32, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,69,0,0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="ml-3 text-xs text-white/40">
            orderflow.ai
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 space-y-4">
          {/* Incoming call indicator */}
          <motion.div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(255,69,0,0.08)",
              border: "1px solid rgba(255,69,0,0.2)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,69,0,0.15)" }}
            >
              <Phone size={18} className="text-[#FF4500]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Incoming Call</p>
              <p className="text-xs text-white/40">+1 (770) 525-5393</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span
                className="text-xs font-mono font-bold px-2 py-1 rounded text-[#FF4500]"
                style={{ background: "rgba(255,69,0,0.15)" }}
              >
                LIVE
              </span>
            </div>
          </motion.div>

          {/* Order items */}
          {[
            { item: "2× Ribeye Steak", status: "confirmed", time: "0:04" },
            { item: "1× Caesar Salad", status: "confirmed", time: "0:11" },
            { item: "1× Truffle Fries", status: "confirmed", time: "0:17" },
            { item: "+ Add Dessert", status: "ai-suggested", time: "0:22" },
          ].map((row, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 py-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
            >
              <CheckCircle2
                size={14}
                className="flex-shrink-0"
                style={{
                  color:
                    row.status === "ai-suggested" ? "#FF4500" : "#22C55E",
                }}
              />
              <span
                className="text-sm flex-1"
                style={{
                  color:
                    row.status === "ai-suggested"
                      ? "#FF4500"
                      : "rgba(240,244,255,1)",
                  fontWeight: row.status === "ai-suggested" ? 600 : 400,
                }}
              >
                {row.item}
              </span>
              <span className="text-xs font-mono text-white/40">
                {row.time}
              </span>
            </motion.div>
          ))}

          {/* Order total */}
          <motion.div
            className="flex items-center justify-between pt-3 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#FF4500]" />
              <span className="text-sm font-semibold text-white">
                Order confirmed
              </span>
            </div>
            <span className="text-sm font-black text-[#FF4500]">$34.50</span>
          </motion.div>
        </div>
      </div>

      {/* Floating accent badge */}
      <motion.div
        className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full text-xs font-bold text-[#FF4500]"
        style={{
          background: "rgba(255,69,0,0.12)",
          border: "1px solid rgba(255,69,0,0.3)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      >
        ⚡ Order placed in 27 seconds
      </motion.div>
    </motion.div>
  );
}

// ── Pill button — layered construction ──
function PillButton({
  variant,
  label,
  href,
}: {
  variant: "dark" | "light";
  label: string;
  href?: string;
}) {
  const isLight = variant === "light";
  const Tag = href ? "a" : "button";

  return (
    <Tag
      {...(href ? { href } : {})}
      className="relative inline-flex rounded-full cursor-pointer no-underline"
      style={{
        padding: "0.6px",
        border: "0.6px solid rgba(255,255,255,0.6)",
      }}
    >
      {/* White glow streak along top edge */}
      <span
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, transparent 70%)",
          filter: "blur(1.5px)",
        }}
        aria-hidden="true"
      />
      <span
        className="relative rounded-full text-[14px] font-medium transition-opacity hover:opacity-80 flex items-center"
        style={{
          padding: "11px 29px",
          background: isLight ? "#ffffff" : "#000000",
          color: isLight ? "#000000" : "#ffffff",
        }}
      >
        {label}
      </span>
    </Tag>
  );
}

// ── Hero — with kinetic typography and scroll effects ──
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // GSAP kinetic typography on load
  useGSAP(() => {
    if (!headlineRef.current) return;

    // Split headline into words
    const headline = headlineRef.current;
    const text = headline.textContent || "";
    headline.innerHTML = "";
    
    const words = text.split(" ").filter(Boolean);
    words.forEach((word) => {
      const span = document.createElement("span");
      span.className = "headline-word inline-block";
      span.style.opacity = "0";
      span.style.transform = "translateY(40px) rotateX(-15deg)";
      span.style.transformOrigin = "center bottom";
      span.style.display = "inline-block";
      span.style.marginRight = "0.25em";
      span.textContent = word;
      headline.appendChild(span);
    });

    // Animate words in with stagger
    const wordElements = headline.querySelectorAll(".headline-word");
    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.3,
    });

    // Scroll-triggered scale and fade for headline
    gsap.to(headline, {
      scale: 0.95,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Parallax for terminal (slower = depth)
    if (terminalRef.current) {
      gsap.to(terminalRef.current, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#131313] to-[#1a0a0a]">
      {/* Ambient ember glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(138,43,226,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* All content sits above the gradient */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-[120px] pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — 55% */}
          <div className="flex flex-col gap-8">

            {/* Gradient headline — kinetic typography with GSAP */}
            <h1
              ref={headlineRef}
              className="text-[56px] max-md:text-[36px] font-medium leading-[1.28] tracking-tight max-w-[613px]"
              style={{
                background:
                  "linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                perspective: "1000px",
              }}
            >
              Take Orders While You Sleep
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-[15px] font-normal leading-relaxed max-w-[500px] -mt-2"
              style={{ color: "rgba(255,255,255,0.70)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              The AI voice agent that answers every call, upsells naturally,
              and delivers — 24/7. No app downloads. No new phone number.
              Live in 30 seconds.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <PillButton variant="light" label="Start Free 14-Day Trial" href="#pricing" />
              <PillButton variant="dark" label="Book a Demo" href="#lead-form" />
            </motion.div>

            {/* Phone CTA with live badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <a
                href="tel:+17705255393"
                className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                <Phone
                  size={14}
                  style={{ color: "rgba(255,255,255,0.70)" }}
                />
                Or call us:{" "}
                <span className="font-semibold text-white">
                  +1 (770) 525-5393
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </a>
            </motion.div>

          </div>

          {/* Right — 45% terminal mockup with 3D phone above */}
          <div ref={terminalRef} className="relative hidden lg:block">
            <HeroPhone3D />
            <TerminalMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

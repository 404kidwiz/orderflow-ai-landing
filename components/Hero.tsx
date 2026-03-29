"use client";

import { motion } from "framer-motion";
import { Phone, CheckCircle2, Clock } from "lucide-react";

// ── Terminal mockup — kept intact, adjusted for video background context ──
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
            "0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(59,130,246,0.06)",
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
            orderflow.ai/dashboard
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 space-y-4">
          {/* Incoming call indicator */}
          <motion.div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.15)" }}
            >
              <Phone size={18} className="text-[#3B82F6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Incoming Call</p>
              <p className="text-xs text-white/40">(404) 555-0182</p>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded text-[#3B82F6]"
              style={{ background: "rgba(59,130,246,0.15)" }}
            >
              LIVE
            </span>
          </motion.div>

          {/* Order items */}
          {[
            { item: "2× Crunchy Taco Supreme", status: "confirmed", time: "0:03" },
            { item: "1× Baja Blast Freeze (L)", status: "confirmed", time: "0:08" },
            { item: "1× Mexican Pizza", status: "confirmed", time: "0:12" },
            { item: "+ Add Nachos Supreme", status: "ai-suggested", time: "0:19" },
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
                    row.status === "ai-suggested" ? "#3B82F6" : "#22C55E",
                }}
              />
              <span
                className="text-sm flex-1"
                style={{
                  color:
                    row.status === "ai-suggested"
                      ? "#3B82F6"
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
              <Clock size={14} className="text-[#3B82F6]" />
              <span className="text-sm font-semibold text-white">
                Order confirmed
              </span>
            </div>
            <span className="text-sm font-black text-[#3B82F6]">$18.47</span>
          </motion.div>
        </div>
      </div>

      {/* Floating accent badge */}
      <motion.div
        className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full text-xs font-bold text-[#3B82F6]"
        style={{
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.3)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.4 }}
      >
        ⚡ Order placed in 23 seconds
      </motion.div>
    </motion.div>
  );
}

// ── Pill button — layered construction per Web3 spec ──
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

// ── Hero — Web3 video bg merged with OrderFlow content ──
export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Fullscreen looping background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* 50% black overlay for readability */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* All content sits above the video */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-[120px] pt-32 pb-24 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — 55% */}
          <div className="flex flex-col gap-8">

            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  borderRadius: "20px",
                }}
              >
                <span className="w-1 h-1 rounded-full bg-white flex-shrink-0" />
                <span style={{ color: "rgba(255,255,255,0.60)" }}>
                  Early access available from{" "}
                </span>
                <span className="text-white">May 1, 2026</span>
              </span>
            </motion.div>

            {/* Gradient headline — 144.5deg white → transparent */}
            <motion.h1
              className="text-[56px] max-md:text-[36px] font-medium leading-[1.28] tracking-tight max-w-[613px]"
              style={{
                background:
                  "linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Take Orders While You Sleep
            </motion.h1>

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
              <PillButton variant="light" label="Start Free Trial" href="#lead-form" />
              <PillButton variant="dark" label="Book a Demo" href="#book-demo" />
            </motion.div>

            {/* Phone CTA */}
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
              </a>
            </motion.div>

          </div>

          {/* Right — 45% terminal mockup */}
          <div className="relative hidden lg:block">
            <TerminalMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

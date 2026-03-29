"use client";

import { motion } from "framer-motion";
import { Phone, Play, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

function TerminalMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md mx-auto lg:mx-0"
    >
      {/* Terminal card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--border), 0 0 60px rgba(59,130,246,0.08)",
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }} />
          <span className="ml-3 text-xs" style={{ color: "var(--text-muted)" }}>
            orderflow.ai/dashboard
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 space-y-4">
          {/* Incoming call indicator */}
          <motion.div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.15)" }}
            >
              <Phone size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Incoming Call
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                (404) 555-0182
              </p>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded"
              style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent)" }}
            >
              LIVE
            </span>
          </motion.div>

          {/* Order items */}
          {[
            { item: "2× Crunchy Taco Supreme", status: "confirmed", time: "0:03" },
            { item: "1× Baja Blast Freeze (L)", status: "confirmed", time: "0:08" },
            { item: "1× Mexican Pizza", status: "confirmed", time: "0:12" },
            { item: "+ AddNachos Supreme", status: "ai-suggested", time: "0:19" },
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
                style={{
                  color: row.status === "ai-suggested" ? "var(--accent)" : "#22C55E",
                  flexShrink: 0,
                }}
              />
              <span
                className="text-sm flex-1"
                style={{
                  color: row.status === "ai-suggested" ? "var(--accent)" : "var(--text-primary)",
                  fontWeight: row.status === "ai-suggested" ? 600 : 400,
                }}
              >
                {row.item}
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                {row.time}
              </span>
            </motion.div>
          ))}

          {/* Order total */}
          <motion.div
            className="flex items-center justify-between pt-3 mt-2"
            style={{ borderTop: "1px solid var(--border)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Order confirmed
              </span>
            </div>
            <span className="text-sm font-black" style={{ color: "var(--accent)" }}>
              $18.47
            </span>
          </motion.div>
        </div>
      </div>

      {/* Floating accent badge */}
      <motion.div
        className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full text-xs font-bold"
        style={{
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.3)",
          color: "var(--accent)",
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

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(59,130,246,0.05) 0%, transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — 55% */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--accent-dim)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "var(--accent)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                AI-Powered Voice Ordering
              </span>
            </motion.div>

            {/* Headline — 3 lines, pain point */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6"
              style={{ color: "var(--text-primary)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Missed calls
              <br />
              <span style={{ color: "var(--accent)" }}>cost you</span>{" "}
              orders.
              <br />
              <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>
                Not anymore.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "var(--text-muted)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              OrderFlow answers every call with natural AI conversation. Takes the order. Handles modifications. Texts confirmation. You focus on the food.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm font-bold transition-all duration-200"
                style={{
                  background: "var(--accent)",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(59,130,246,0.35)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.35)")}
              >
                Start Free Trial
                <ArrowRight size={16} />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm font-bold transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-strong)",
                }}
              >
                <Play size={14} />
                Watch Demo
              </a>
            </motion.div>

            {/* Phone CTA */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <a
                href="tel:+17705255393"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <Phone size={14} style={{ color: "var(--accent)" }} />
                Or call us:{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  +1 (770) 525-5393
                </span>
              </a>
            </motion.div>
          </div>

          {/* Right — 45% */}
          <div className="relative">
            <TerminalMockup />
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #131313 50%, #1a0a0a 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,69,0,0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <CheckCircle2 size={40} color="#22c55e" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl font-medium mb-4 leading-tight"
          style={{
            background: "linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          You&apos;re all set!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.60)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          Check your email for login credentials.
          Your first AI voice agent is being set up right now.
        </motion.p>

        {/* Next steps */}
        <motion.div
          className="rounded-2xl p-6 mb-8 text-left space-y-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <p className="text-sm font-semibold text-white mb-3">What happens next</p>
          {[
            "Check your inbox for your OrderFlow login link",
            "Set up your menu and restaurant profile",
            "Point your existing phone number to OrderFlow",
            "Start taking orders — your AI agent goes live in minutes",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: "rgba(255,69,0,0.15)",
                  color: "#FF4500",
                }}
              >
                {i + 1}
              </span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
                {step}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <a
            href="https://orderflow.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #FF4500, #FF6B35)",
            }}
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </a>
          <a
            href="tel:+17705255393"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.70)",
            }}
          >
            <Phone size={14} />
            Need help? Call us
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}

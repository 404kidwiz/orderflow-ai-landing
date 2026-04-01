"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, TrendingUp, Globe } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature callout cards
const CALLOUTS = [
  {
    icon: Phone,
    title: "Instant Call Handling",
    description: "Every call answered in under 2 seconds, 24/7",
    stat: "2s response",
  },
  {
    icon: TrendingUp,
    title: "Revenue Uplift",
    description: "AI-powered upselling increases average order value",
    stat: "+23%",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Serve customers in 12+ languages automatically",
    stat: "12+ langs",
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Sticky scroll effect for product frame
  useGSAP(() => {
    if (!frameRef.current || typeof window === "undefined") return;

    // Check for mobile - skip sticky scroll on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    gsap.fromTo(
      frameRef.current,
      { scale: 0.85, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,69,0,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            The Dashboard
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            See everything.
            <br />
            <span className="gradient-text">Miss nothing.</span>
          </h2>
        </motion.div>

        {/* Product frame - dashboard mockup */}
        <motion.div
          ref={frameRef}
          className="relative mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(32, 31, 31, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 40px 100px rgba(0,0,0,0.5), 0 0 80px rgba(255,69,0,0.06)",
            }}
          >
            {/* Dashboard header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
              </div>
              <span className="ml-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                OrderFlow Dashboard
              </span>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Today's Orders", value: "147", change: "+12%" },
                  { label: "Revenue", value: "$4,231", change: "+8%" },
                  { label: "Avg Order Value", value: "$28.78", change: "+5%" },
                  { label: "AI Accuracy", value: "98.2%", change: "+0.3%" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-xl md:text-2xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {stat.value}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#22c55e" }}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity graph placeholder */}
              <div
                className="h-40 md:h-48 rounded-xl mb-6 flex items-end justify-between p-4 gap-2"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {[
                  40, 65, 55, 80, 70, 90, 85, 75, 95, 88, 92, 78, 85, 100, 90, 82,
                ].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, rgba(255,69,0,0.6), rgba(255,69,0,0.2))`,
                    }}
                  />
                ))}
              </div>

              {/* Recent orders */}
              <div className="space-y-3">
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Recent Orders
                </p>
                {[
                  { time: "12:34 PM", items: "2x Burger, 1x Fries", total: "$32.50", status: "Completed" },
                  { time: "12:28 PM", items: "1x Salad, 1x Drink", total: "$18.00", status: "Completed" },
                  { time: "12:15 PM", items: "3x Pizza, 2x Wings", total: "$67.50", status: "In Progress" },
                ].map((order, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-mono"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {order.time}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.items}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--ember)" }}
                      >
                        {order.total}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background:
                            order.status === "Completed"
                              ? "rgba(34, 197, 94, 0.15)"
                              : "rgba(255, 69, 0, 0.15)",
                          color:
                            order.status === "Completed" ? "#22c55e" : "var(--ember)",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature callout cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CALLOUTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--obsidian-high)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,69,0,0.1)" }}
                  >
                    <Icon size={24} style={{ color: "var(--ember)" }} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm mb-3"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.description}
                    </p>
                    <span
                      className="inline-block text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(255,69,0,0.1)",
                        color: "var(--ember)",
                      }}
                    >
                      {item.stat}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

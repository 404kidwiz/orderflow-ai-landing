"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, Rocket } from "lucide-react";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-production-90b5.up.railway.app";
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Partner Program",
          email,
          phone: "",
          restaurant: "",
          type: "founding_partner",
          description: "Founding Partner Program signup from landing page",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.eyebrow}>Exclusive Early Access</p>
          <h2 className={styles.title}>
            Become a Founding Partner
          </h2>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(255,69,0,0.15), rgba(138,43,226,0.1))",
                border: "1px solid rgba(255,69,0,0.2)",
              }}
            >
              <Rocket size={28} className="text-[var(--ember)]" />
            </div>
          </div>

          <p className="text-[18px] text-[var(--ash)] leading-relaxed mb-8">
            Join the first 50 restaurants to shape OrderFlow AI. Founding Partners get{" "}
            <span className="text-[var(--silk)] font-semibold">lifetime free setup</span>,{" "}
            <span className="text-[var(--silk)] font-semibold">priority support</span>, and{" "}
            <span className="text-[var(--ember)] font-semibold">locked-in founding pricing</span> — forever.
          </p>

          <ul className="list-none flex flex-col gap-3 mb-10 text-left max-w-md mx-auto">
            {[
              "Free white-glove onboarding & menu setup",
              "50% off your first 6 months — locked in for life",
              "Direct line to the founding team for feature requests",
              "Early access to new AI capabilities before anyone else",
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[var(--ash)]">
                <CheckCircle size={16} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>

          {status === "success" ? (
            <motion.div
              className="flex items-center justify-center gap-3 py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={24} className="text-[#22c55e]" />
              <span className="text-[var(--silk)] font-semibold">You&apos;re on the list! We&apos;ll reach out within 24 hours.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 bg-white/5 border border-[var(--border)] rounded-xl text-[15px] text-[var(--silk)] outline-none transition-all duration-200 focus:border-[var(--ember)] focus:shadow-[0_0_0_3px_rgba(255,69,0,0.15)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[linear-gradient(135deg,var(--ember)_0%,var(--ember-glow)_100%)] border-none rounded-xl text-[14px] font-bold text-white cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(255,69,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,69,0,0.4)] disabled:opacity-70"
              >
                {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {status === "loading" ? "Joining..." : "Join the Program"}
              </button>
            </form>
          )}

          <p className="text-[13px] text-[var(--ash)] mt-4 opacity-60">
            Only {50} spots available · No commitment required
          </p>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = " ",
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className={`relative ${focused ? "focused-field" : ""}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pt-[22px] pb-[10px] px-[18px] bg-white/5 border rounded-xl text-[15px] text-[var(--silk)] outline-none transition-all duration-200 ${focused ? "border-[var(--ember)] bg-white/5 shadow-[0_0_0_3px_rgba(255,69,0,0.15),0_0_20px_rgba(255,69,0,0.1)]" : "border-[var(--border)]"}`}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <label
          htmlFor={id}
          className={`absolute left-[18px] transition-all duration-200 pointer-events-none px-1 bg-transparent ${
            focused || hasValue 
              ? "top-2 -translate-y-0 text-[11px] font-semibold text-[var(--ember)] bg-[var(--obsidian)] uppercase tracking-[0.05em]" 
              : "top-1/2 -translate-y-1/2 text-[15px] text-[var(--ash)]"
          }`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

function FloatingSelect({
  id,
  label,
  value,
  onChange,
  required = false,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className={`relative ${focused ? "focused-field" : ""}`}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pt-[22px] pb-[10px] px-[18px] bg-white/5 border rounded-xl text-[15px] text-[var(--silk)] outline-none transition-all duration-200 appearance-none ${focused ? "border-[var(--ember)] bg-white/5 shadow-[0_0_0_3px_rgba(255,69,0,0.15),0_0_20px_rgba(255,69,0,0.1)]" : "border-[var(--border)]"}`}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <option value="" disabled hidden />
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={`absolute left-[18px] transition-all duration-200 pointer-events-none px-1 bg-transparent ${
            focused || hasValue
              ? "top-2 -translate-y-0 text-[11px] font-semibold text-[var(--ember)] bg-[var(--obsidian)] uppercase tracking-[0.05em]"
              : "top-1/2 -translate-y-1/2 text-[15px] text-[var(--ash)]"
          }`}
        >
          {label}
        </label>
        <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ash)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MagneticSubmit({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="submit"
      className="flex items-center justify-center gap-2.5 px-6 py-4 bg-[linear-gradient(135deg,var(--ember)_0%,var(--ember-glow)_100%)] border-none rounded-[14px] text-base font-bold text-white cursor-pointer transition-all duration-200 shadow-[0_8px_30px_rgba(255,69,0,0.3)] will-change-transform disabled:opacity-70 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_12px_40px_rgba(255,69,0,0.4)]"
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", locations: "", restaurant: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    setStatus("loading");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-production-90b5.up.railway.app";
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          restaurant: form.restaurant,
          type: "catering",
          description: `Lead from landing page — ${form.restaurant || "No restaurant name"}`,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setMsg("Thanks! We'll be in touch within 24 hours.");
        setForm({ name: "", email: "", phone: "", locations: "", restaurant: "" });
      } else {
        setStatus("error");
        setMsg("Something went wrong. Try again or call us directly.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  };

  return (
    <section id="lead-form" className="py-20 md:py-32 px-6" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--ember) 3%, transparent), transparent)" }}>
      <div className="max-w-[1080px] mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 p-8 md:p-12 bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-[32px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-[clamp(28px,4vw,40px)] font-black tracking-tight text-[var(--silk)] leading-[1.1]">Ready to start?</h2>
            <p className="text-[17px] text-[var(--ash)] leading-[1.6]">
              Get started with your free setup in under 30 minutes. No credit card required.
            </p>
            <ul className="list-none flex flex-col gap-3">
              {["14-day free trial", "No credit card required", "Cancel anytime"].map((b, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[15px] text-[var(--ash)]">
                  <CheckCircle size={16} className="text-[#22c55e]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {status === "success" ? (
              <motion.div
                className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center text-base text-[var(--silk)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle size={48} className="text-[#22c55e]" />
                <p>{msg}</p>
              </motion.div>
            ) : (
              <>
                <FloatingInput
                  id="name"
                  label="Full Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <FloatingInput
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                <FloatingInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                />
                <FloatingSelect
                  id="locations"
                  label="Locations"
                  value={form.locations}
                  onChange={(v) => setForm({ ...form, locations: v })}
                  required
                  options={[
                    { value: "1", label: "1 location" },
                    { value: "2-5", label: "2-5 locations" },
                    { value: "6-10", label: "6-10 locations" },
                    { value: "11+", label: "11+ locations" },
                  ]}
                />
                <FloatingInput
                  id="restaurant"
                  label="Restaurant Name (Optional)"
                  value={form.restaurant}
                  onChange={(v) => setForm({ ...form, restaurant: v })}
                />

                <MagneticSubmit disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Start Your Free Trial
                    </>
                  )}
                </MagneticSubmit>

                {status === "error" && <p className="text-[#ef4444] text-[14px]">{msg}</p>}
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

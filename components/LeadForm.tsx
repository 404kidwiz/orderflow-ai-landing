"use client";

import { useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";
import styles from "./LeadForm.module.css";

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
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
    <div className={styles.field}>
      <div className={`${styles.inputWrapper} ${focused ? styles.focused : ""}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <label
          htmlFor={id}
          className={`${styles.floatLabel} ${focused || hasValue ? styles.floatLabelActive : ""}`}
        >
          {label}
        </label>
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
      className={styles.submit}
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", restaurant: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    setStatus("loading");

    // Simulate API call (would connect to backend in production)
    setTimeout(() => {
      setStatus("success");
      setMsg("Thanks! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", restaurant: "" });
    }, 1500);
  };

  return (
    <section id="lead-form" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.content}>
            <h2 className={styles.title}>Ready to start?</h2>
            <p className={styles.desc}>
              Join 500+ restaurants already using OrderFlow. Get your free setup in under 30 minutes.
            </p>
            <ul className={styles.benefits}>
              {["14-day free trial", "No credit card required", "Cancel anytime"].map((b, i) => (
                <li key={i} className={styles.benefit}>
                  <CheckCircle size={16} color="#22c55e" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {status === "success" ? (
              <motion.div
                className={styles.success}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle size={48} color="#22c55e" />
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
                  placeholder=" "
                />
                <FloatingInput
                  id="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                  placeholder=" "
                />
                <FloatingInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  required
                  placeholder=" "
                />
                <FloatingInput
                  id="restaurant"
                  label="Restaurant Name (Optional)"
                  value={form.restaurant}
                  onChange={(v) => setForm({ ...form, restaurant: v })}
                  placeholder=" "
                />

                <MagneticSubmit disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className={styles.spin} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Get Started Free
                    </>
                  )}
                </MagneticSubmit>

                {status === "error" && <p className={styles.error}>{msg}</p>}
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, CheckCircle } from "lucide-react";

const DEMO_MESSAGES = [
  { role: "ai", text: "Thanks for calling Sal's Pizza! What can I get started for you today?" },
  { role: "customer", text: "Yeah, I'd like a large pepperoni pizza and two Cokes." },
  { role: "ai", text: "Great choice! That's a large pepperoni and two Cokes. Anything else? Maybe some garlic knots?" },
  { role: "customer", text: "Oh yeah, add some of those." },
  { role: "ai", text: "Perfect. That's a large pepperoni, garlic knots, and two Cokes. Your total is $28.47. Ready in about 20 minutes!" },
];

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] h-full bg-[var(--ember)] rounded-[2px] min-h-[2px]"
          animate={active ? {
            scaleY: [0.2, 1, 0.4, 0.8, 0.3, 1, 0.5],
          } : { scaleY: 0.2 }}
          transition={{
            duration: 0.8,
            repeat: active ? Infinity : 0,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

export default function LiveDemo() {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_MESSAGES>([]);
  const [userInput, setUserInput] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-play demo on mount
  useEffect(() => {
    let delay = 500;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < DEMO_MESSAGES.length; i++) {
      const t = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, DEMO_MESSAGES[i]]);
        if (i === DEMO_MESSAGES.length - 1) {
          setTimeout(() => setOrderConfirmed(true), 800);
        }
      }, delay);
      timers.push(t);
      delay += (DEMO_MESSAGES[i].text.length * 30) + 1500;
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = { role: "customer" as const, text: userInput };
    setVisibleMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      setVisibleMessages((prev) => [
        ...prev,
        { role: "ai", text: "Perfect. Your order has been confirmed! We'll text you when it's ready." },
      ]);
      setTimeout(() => setOrderConfirmed(true), 600);
    }, 2500);
  };

  return (
    <section id="demo" className="py-20 md:py-32 px-6" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--ember) 2%, transparent), transparent)" }}>
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--ember)]/25 bg-[var(--ember)]/10 text-[var(--ember)] text-[13px] font-semibold mb-5">
            <Phone size={14} />
            Live Demo: +1 (770) 525-5393
          </div>
          <h2 className="font-serif text-[clamp(32px,5vw,52px)] font-black tracking-tight text-[var(--silk)] mb-4">See OrderFlow In Action</h2>
          <p className="text-lg text-[var(--ash)] max-w-[500px] mx-auto leading-[1.6]">
            Watch how our AI takes a real phone order — naturally, accurately, and fast.
          </p>
        </motion.div>

        {/* Demo Area */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {/* Phone Mockup */}
          <div className="relative w-full max-w-[340px] lg:max-w-[340px] md:max-w-[300px] mx-auto bg-[#1a1a24] rounded-[44px] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]">
            <div className="w-[100px] h-[28px] bg-[var(--obsidian-deep)] rounded-[20px] mx-auto mb-3" />
            <div className="bg-[#111118] rounded-[32px] p-4 min-h-[420px] flex flex-col">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border)] mb-3">
                <span className="text-[15px] font-bold text-[var(--silk)]">Sal's Pizza</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#22c55e]">
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
                  AI Active
                </span>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                <AnimatePresence>
                  {visibleMessages.map((msg, i) => (
                    <motion.div
                      key={`${msg.role}-${i}`}
                      className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`max-w-[85%] p-2.5 px-3.5 rounded-2xl text-[13px] leading-[1.5] ${msg.role === "ai" ? "bg-[var(--ember)]/10 border border-[var(--ember)]/20 text-[var(--silk)] rounded-bl-sm" : "bg-[var(--violet)]/20 border border-[var(--violet)]/30 text-[var(--silk)] rounded-br-sm"}`}>
                        {msg.role === "ai" && (
                          <div className="flex items-center gap-0.5 h-5 mb-1.5">
                            <WaveformBars active={i === visibleMessages.length - 1 && msg.role === "ai" && !orderConfirmed} />
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {aiTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="max-w-[85%] p-2.5 px-3.5 rounded-2xl text-[13px] leading-[1.5] bg-[var(--ember)]/10 border border-[var(--ember)]/20 text-[var(--silk)] rounded-bl-sm flex items-center">
                      <WaveformBars active />
                      <span className="text-[12px] text-[var(--ash)] ml-2">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {orderConfirmed && (
                <motion.div
                  className="flex items-center gap-2 p-2.5 px-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-[13px] font-semibold text-[#22c55e] my-2"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={16} />
                  <span>Order Confirmed — $28.47</span>
                </motion.div>
              )}

              <form className="flex gap-2 mt-auto pt-3 border-t border-[var(--border)]" onSubmit={handleUserSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Try it — type an order..."
                  className="flex-1 bg-white/5 border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-[13px] text-[var(--silk)] outline-none focus:border-[var(--ember)] transition-colors placeholder-[var(--ash)]"
                />
                <button type="submit" className="bg-[var(--ember)] border-none rounded-xl p-2.5 text-white cursor-pointer hover:scale-105 transition-transform flex items-center justify-center">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-8">
            <h3 className="font-serif text-[clamp(24px,3vw,36px)] font-black tracking-tight text-[var(--silk)] leading-[1.2]">Talk to OrderFlow like you'd talk to your best employee</h3>
            <ul className="flex flex-col gap-4 list-none">
              {[
                "Natural conversation — no scripts, no button presses",
                "Handles complex mods: 'large pepperoni, extra cheese, no onions'",
                "Smart upselling at the perfect moment",
                "SMS confirmation sent instantly to your customer",
                "Order drops directly into your kitchen display",
              ].map((f, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-base text-[var(--ash)] leading-[1.5]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="shrink-0 w-[22px] h-[22px] rounded-full bg-[var(--ember)]/10 border border-[var(--ember)]/25 flex items-center justify-center mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="var(--ember)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does OrderFlow work?",
    a: "We give you a dedicated phone number. When customers call, our AI answers, takes their order naturally, and sends it directly to your kitchen. No apps, no websites, no training required.",
  },
  {
    q: "What if the AI can't understand the customer?",
    a: "OrderFlow handles 99.4% of calls autonomously. For the rare complex order, it seamlessly transfers to your phone with a full transcript. You never miss a sale.",
  },
  {
    q: "Can I use my existing phone number?",
    a: "Yes! We can port your existing number for $30 (one-time). Or we give you a new dedicated number free with any plan.",
  },
  {
    q: "Does it integrate with my POS?",
    a: "We integrate with Toast, Square, Clover, and 20+ other POS systems. OrderFlow sends orders directly to your kitchen display or printer.",
  },
  {
    q: "Is there a free trial?",
    a: "Absolutely. Every plan comes with a 14-day free trial. No credit card required. Full features, zero risk.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Month-to-month billing. Cancel in one click from your dashboard. No hidden fees, no early termination penalties.",
  },
  {
    q: "How long does setup take?",
    a: "Most restaurants are live in under 30 minutes. Enter your menu, pick your plan, and start taking calls. Seriously.",
  },
  {
    q: "What languages does it support?",
    a: "English is fully live. Spanish, French, and Mandarin are in beta. Contact us for enterprise language customization.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-black tracking-tight text-[var(--silk)] leading-[1.1] mb-4">
            Frequently asked
            <br />
            <span className="text-[var(--smoke)]">questions</span>
          </h2>
          <p className="text-lg text-[var(--ash)]">
            Everything you need to know about OrderFlow.
          </p>
        </motion.div>

        <Accordion.Root
          type="single"
          value={openIndex?.toString() ?? ""}
          onValueChange={(v) => setOpenIndex(v ? parseInt(v) : null)}
          className="flex flex-col gap-3"
        >
          {FAQS.map((faq, i) => (
            <Accordion.Item key={i} value={i.toString()} className="relative bg-[var(--glass)] border border-[var(--border)] rounded-2xl overflow-hidden transition-colors duration-200 hover:border-[var(--ember)]/20 group">
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--ember)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom rounded-l-[3px] ${openIndex === i ? 'scale-y-100' : 'scale-y-0'}`} />
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex justify-between items-center py-5 px-6 bg-transparent border-none cursor-pointer text-left focus:outline-none">
                  <span className="text-[17px] font-semibold text-[var(--silk)] leading-[1.4]">{faq.q}</span>
                  <motion.div
                    className={`shrink-0 transition-colors duration-200 ${openIndex === i ? 'text-[var(--ember)]' : 'text-[var(--ash)]'}`}
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-5 text-[15px] text-[var(--ash)] leading-[1.7]">{faq.a}</p>
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

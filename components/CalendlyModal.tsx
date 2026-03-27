"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";

interface CalendlyModalProps {
  url?: string;
}

export default function CalendlyModal({ url }: CalendlyModalProps) {
  // Replace with your Calendly link, e.g. "https://calendly.com/yourusername/30min"
  const calendlyUrl = url || "https://calendly.com";

  useEffect(() => {
    const handleHash = () => {
      const modal = document.getElementById("calendly-modal");
      if (!modal) return;
      if (window.location.hash === "#book-demo") {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      } else {
        modal.classList.remove("open");
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("hashchange", handleHash);
    handleHash(); // Check on mount
    return () => {
      window.removeEventListener("hashchange", handleHash);
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    window.location.hash = "";
    document.body.style.overflow = "";
  };

  return (
    <>
      <style>{`
        #calendly-modal { display: none; }
        #calendly-modal.open { display: flex; }
      `}</style>
      <div
        id="calendly-modal"
        className="fixed inset-0 z-[9999] items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl bg-[var(--void)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/20 flex items-center justify-center">
                <Calendar size={18} className="text-[var(--orange)]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Book Your Demo</h3>
                <p className="text-[var(--gray-600)] text-sm">30-minute strategy call — no sales pitch</p>
              </div>
            </div>
            <button
              onClick={close}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[var(--gray-600)] hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Calendly Embed */}
          <div className="w-full h-[680px] p-2">
            <iframe
              src={`${calendlyUrl}?hide_gdpr_banner=1&primary_color=ff6b35`}
              className="w-full h-full rounded-2xl border-0"
              title="Book a Demo"
              allow="camera; microphone; autoplay; encrypted-media"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}

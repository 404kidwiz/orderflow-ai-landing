"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroPhone3D() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute top-0 right-0 w-[280px] h-[400px] pointer-events-none opacity-90 hidden xl:block z-10"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
        style={{
          transform: `rotateY(${mouse.x * 8}deg) rotateX(${-mouse.y * 5}deg)`,
          transition: "transform 0.3s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Ember glow behind phone */}
        <div
          className="absolute inset-0 rounded-[3rem]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,69,0,0.12) 0%, transparent 70%)",
            filter: "blur(30px)",
            transform: "scale(1.3) translateZ(-20px)",
          }}
        />

        {/* Phone frame */}
        <div
          className="relative mx-auto w-[180px] h-[360px] rounded-[2rem]"
          style={{
            background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)",
            boxShadow: `
              0 30px 80px rgba(0,0,0,0.6),
              0 0 40px rgba(255,69,0,0.08),
              inset 0 1px 0 rgba(255,255,255,0.1),
              inset 0 -1px 0 rgba(255,255,255,0.03)
            `,
            border: "1px solid rgba(255,255,255,0.08)",
            transform: "translateZ(10px)",
          }}
        >
          {/* Screen */}
          <div
            className="absolute top-[10px] left-[10px] right-[10px] bottom-[10px] rounded-[1.5rem] overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Camera notch */}
            <div
              className="absolute top-[12px] right-[16px] w-[8px] h-[8px] rounded-full"
              style={{
                background: "radial-gradient(circle, #1a1a2e 30%, #0d0d15 100%)",
                boxShadow: "0 0 3px rgba(255,255,255,0.1)",
              }}
            />

            {/* Screen content lines */}
            <div className="absolute top-[32px] left-[16px] right-[16px] space-y-3">
              <div
                className="h-[18px] rounded-md"
                style={{
                  background: "linear-gradient(90deg, rgba(255,69,0,0.5) 0%, rgba(255,69,0,0.3) 100%)",
                  width: "70%",
                }}
              />
              <div
                className="h-[8px] rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  width: "90%",
                }}
              />
              <div
                className="h-[6px] rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  width: "75%",
                }}
              />
              <div
                className="h-[10px] rounded-md mt-4"
                style={{
                  background: "linear-gradient(90deg, rgba(138,43,226,0.35) 0%, rgba(138,43,226,0.15) 100%)",
                  width: "60%",
                }}
              />
            </div>

            {/* Animated shimmer */}
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: "linear-gradient(135deg, transparent 40%, rgba(255,69,0,0.03) 50%, transparent 60%)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

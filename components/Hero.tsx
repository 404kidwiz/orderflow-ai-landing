"use client";

import { useRef, useEffect, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree, ThreeElements } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Phone, Play, Calendar, ChevronDown } from "lucide-react";
import styles from "./Hero.module.css";

function Particles({ count = 2000 }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const scroll = useScroll();

  const scrollProgress = scroll.scrollYProgress;

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const positions = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Wave pattern
      positions[i3 + 1] = y + Math.sin(time * 0.5 + x * 0.5) * 0.02;

      // Scatter on scroll
      const scatterAmount = scrollProgress.get() * 2;
      positions[i3] = x + Math.sin(time * 0.3 + i) * 0.01 * scatterAmount;
      positions[i3 + 2] = z + Math.cos(time * 0.3 + i) * 0.01 * scatterAmount;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  // Generate points in a wave/soundwave pattern
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (i / count) * Math.PI * 4;
    positions[i3] = (Math.random() - 0.5) * viewport.width * 2;
    positions[i3 + 1] = Math.sin(t) * (1 + Math.random()) * 2;
    positions[i3 + 2] = (Math.random() - 0.5) * 4;
  }

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FF6B35"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function AmbientOrbs() {
  return (
    <div className={styles.orbs} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orbOrange}`} />
      <div className={`${styles.orb} ${styles.orbPurple}`} />
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className={styles.scrollIndicator}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <span className={styles.scrollText}>Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ChevronDown size={20} color="rgba(255,255,255,0.4)" />
      </motion.div>
    </motion.div>
  );
}

const HEADLINE = ["Take Orders", "While You Sleep"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* 3D Canvas Background */}
      <div className={styles.canvasBg}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <Particles count={typeof window !== "undefined" && window.innerWidth < 768 ? 500 : 2000} />
          </Suspense>
        </Canvas>
      </div>

      <AmbientOrbs />

      {/* Grid overlay */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Content */}
      <motion.div className={styles.content} style={{ y: textY, opacity, scale }}>
        {/* Badge */}
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" fill="#FF6B35" />
          </svg>
          <span>Trusted by 500+ restaurants across Atlanta</span>
        </motion.div>

        {/* Headline */}
        <h1 className={styles.headline}>
          {HEADLINE.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.headlineLine}>
              {line.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className={styles.wordWrapper}>
                  <motion.span
                    className={styles.word}
                    initial={{ opacity: 0, y: 40, rotateX: -40 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.5 + lineIndex * 0.2 + wordIndex * 0.08,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          The AI voice agent that answers calls, up sells, and delivers — 24/7.
          <br className="hidden sm:block" />
          Zero app downloads. No new phone number needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <a href="#lead-form" className={styles.ctaPrimary}>
            Start Free Trial
          </a>
          <a href="#demo" className={styles.ctaSecondary}>
            <Play size={16} fill="currentColor" />
            Watch Demo
          </a>
          <a href="#book-demo" className={styles.ctaSecondary}>
            <Calendar size={16} fill="currentColor" />
            Book a Demo
          </a>
        </motion.div>

        {/* Phone number */}
        <motion.a
          href="tel:+17705255393"
          className={styles.phoneCta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <Phone size={16} />
          Call +1 (770) 525-5393 — Live Demo
        </motion.a>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}

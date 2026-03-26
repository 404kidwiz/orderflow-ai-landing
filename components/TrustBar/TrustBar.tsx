"use client";
import { motion } from "framer-motion";
import styles from "./TrustBar.module.css";

const logos = [
  { name: "Forbes", width: 70 },
  { name: "TechCrunch", width: 120 },
  { name: "Restaurant Business", width: 130 },
  { name: "QSR Magazine", width: 100 },
  { name: "QSR Magazine", width: 100 },
  { name: "Restaurant Business", width: 130 },
  { name: "TechCrunch", width: 120 },
  { name: "Forbes", width: 70 },
];

function LogoItem({ name, width }: { name: string; width: number }) {
  return (
    <svg
      viewBox={`0 0 ${width} 32`}
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.logoSvg}
    >
      <text
        x="0"
        y="24"
        fontFamily="Inter, sans-serif"
        fontWeight={name === "Forbes" ? "900" : "700"}
        fontSize={name === "Forbes" ? "22" : "18"}
        fill="currentColor"
      >
        {name}
      </text>
    </svg>
  );
}

export default function TrustBar() {
  return (
    <section className={styles.section}>
      <motion.p
        className={styles.label}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        As seen in
      </motion.p>
      <div className={styles.marqueeWrapper}>
        <div className={`${styles.marquee} marquee`}>
          {logos.map((logo, i) => (
            <div key={`first-${i}`} className={styles.logoItem}>
              <LogoItem {...logo} />
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className={`${styles.marqueeCopy} marquee`} aria-hidden="true">
          {logos.map((logo, i) => (
            <div key={`second-${i}`} className={styles.logoItem}>
              <LogoItem {...logo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

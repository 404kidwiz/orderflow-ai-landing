import { Variants } from "framer-motion";

// Spring configs
export const SPRING = {
  stiff: { stiffness: 200, damping: 20 },
  soft: { stiffness: 100, damping: 15 },
  bouncy: { stiffness: 300, damping: 18 },
};

// Fade up reveal
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Scale in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Slide in from left/right
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.7 },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.7 },
  },
};

// Word/character reveal
export const charReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Card hover
export const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: "0 0 0 rgba(255,107,53,0)" },
  hover: {
    y: -6,
    scale: 1.02,
    boxShadow: "0 20px 60px rgba(255,107,53,0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Button hover
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 17 } },
  tap: { scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 17 } },
};

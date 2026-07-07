import type { TargetAndTransition, Variants } from "motion/react";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } }
};

export const hoverLift: TargetAndTransition = {
  y: -10,
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
};

export const floating: TargetAndTransition = {
  y: [0, -16, 0],
  x: [0, 8, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
};

export const softPulse: TargetAndTransition = {
  scale: [1, 1.055, 1],
  boxShadow: [
    "0 18px 55px rgba(201,162,39,0.22)",
    "0 24px 80px rgba(201,162,39,0.38)",
    "0 18px 55px rgba(201,162,39,0.22)"
  ],
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
};

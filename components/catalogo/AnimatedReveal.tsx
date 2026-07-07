"use client";

import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animations";

export function AnimatedReveal({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section id={id} className={className} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-90px" }} variants={fadeInUp}>
      {children}
    </motion.section>
  );
}

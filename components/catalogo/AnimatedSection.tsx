"use client";

import { motion } from "motion/react";
import { fadeInUp } from "@/lib/utils/motion";

type AnimatedSectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function AnimatedSection({ id, className, children }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
    >
      {children}
    </motion.section>
  );
}

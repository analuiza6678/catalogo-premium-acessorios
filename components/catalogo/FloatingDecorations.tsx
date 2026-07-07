"use client";

import { motion } from "motion/react";

export function FloatingDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-[8%] top-[18%] size-28 rounded-full bg-rosa-claro/45 blur-2xl"
        animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[10%] top-[22%] size-36 rounded-full bg-dourado-claro/25 blur-3xl"
        animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[14%] left-[18%] size-3 rounded-full bg-dourado"
        animate={{ opacity: [0.25, 0.9, 0.25], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[26%] right-[22%] size-2 rounded-full bg-rosa-blush"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

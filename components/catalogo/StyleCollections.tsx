"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fallbackImages } from "@/lib/mock/catalog";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const collections = [
  { title: "Delicados", text: "Peças leves para acompanhar todos os dias.", image: fallbackImages[0] },
  { title: "Dourados", text: "Brilho quente, elegante e facil de combinar.", image: fallbackImages[1] },
  { title: "Presentes", text: "Escolhas com cara de carinho e celebracao.", image: fallbackImages[4] }
];

export function StyleCollections() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#C9A227]">Coleção editorial</p>
          <h2 className="mt-3 font-serif text-5xl text-[#1E1A18]">Escolha por estilo</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#76675f]">Entre por mood, ocasiao ou intencao: delicadeza, brilho ou presente especial.</p>
      </div>
      <motion.div className="grid gap-5 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
        {collections.map((item) => (
          <motion.article key={item.title} variants={fadeInUp} className="group relative min-h-[390px] overflow-hidden rounded-[38px] shadow-[0_28px_90px_rgba(58,42,36,0.14)]">
            <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,26,24,0.04),rgba(30,26,24,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <h3 className="font-serif text-4xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/78">{item.text}</p>
              <Link href="#produtos" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#3A2A24]">
                Ver peças <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

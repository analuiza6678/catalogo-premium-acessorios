"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fallbackImages } from "@/lib/mock/catalog";
import { floating, scaleIn } from "@/lib/animations";

type FloatingJewelryCollageProps = {
  images: string[];
};

export function FloatingJewelryCollage({ images }: FloatingJewelryCollageProps) {
  const visualImages = [...images, ...fallbackImages].filter(Boolean).slice(0, 3);

  return (
    <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative mx-auto min-h-[430px] max-w-[560px] lg:min-h-[620px]">
      <motion.div animate={floating} className="absolute right-2 top-0 h-[380px] w-[72%] overflow-hidden rounded-[46px] border border-white/70 bg-white p-3 shadow-[0_35px_110px_rgba(58,42,36,0.18)] lg:h-[520px]">
        <div className="relative size-full overflow-hidden rounded-[34px]">
          <Image src={visualImages[0]} alt="Acessorio em destaque" fill priority className="object-cover" />
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute left-0 top-24 h-44 w-44 overflow-hidden rounded-[34px] border border-white/75 bg-white p-2 shadow-[0_24px_70px_rgba(58,42,36,0.16)] lg:h-56 lg:w-56">
        <div className="relative size-full overflow-hidden rounded-[26px]">
          <Image src={visualImages[1]} alt="Detalhe de joia" fill className="object-cover" />
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-4 left-16 h-36 w-48 overflow-hidden rounded-[30px] border border-white/80 bg-white p-2 shadow-[0_24px_70px_rgba(58,42,36,0.14)] lg:bottom-12 lg:left-4 lg:h-44 lg:w-64">
        <div className="relative size-full overflow-hidden rounded-[22px]">
          <Image src={visualImages[2]} alt="Composicao de acessorios" fill className="object-cover" />
        </div>
      </motion.div>
      <motion.div animate={floating} className="absolute bottom-24 right-0 rounded-[26px] border border-white/80 bg-white/70 p-5 shadow-[0_20px_65px_rgba(58,42,36,0.13)] backdrop-blur-xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A227]">Nova coleção</p>
        <p className="mt-2 font-serif text-2xl text-[#1E1A18]">Peças selecionadas</p>
        <p className="mt-1 text-sm text-[#666]">Pedido via WhatsApp</p>
      </motion.div>
      <div className="absolute right-8 top-20 grid size-24 place-items-center rounded-full border border-[#E8C766]/70 bg-[#C9A227] text-center font-serif text-lg text-white shadow-[0_18px_55px_rgba(201,162,39,0.32)]">
        Boutique
      </div>
      <Sparkles className="absolute left-8 top-3 text-[#C9A227]" size={34} />
    </motion.div>
  );
}

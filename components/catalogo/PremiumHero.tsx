"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/utils/motion";
import type { Loja } from "@/types/loja";
import { FloatingDecorations } from "./FloatingDecorations";

export function PremiumHero({ loja }: { loja: Loja }) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Quero conhecer as peças da ${loja.nome}.`);

  return (
    <section id="inicio" className="relative overflow-hidden bg-[linear-gradient(135deg,#FFFFFF_0%,#F8DDEB_48%,#FAF7F2_100%)]">
      <FloatingDecorations />
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 text-center lg:text-left">
          <motion.div variants={scaleIn} className="mx-auto mb-6 grid size-24 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-gold lg:mx-0">
            {loja.logo_url ? <Image src={loja.logo_url} alt={loja.nome} fill className="object-cover" /> : <span className="font-serif text-5xl text-dourado">{loja.nome.charAt(0)}</span>}
          </motion.div>
          <motion.h1 variants={fadeInUp} className="font-serif text-5xl font-medium leading-tight text-preto sm:text-7xl">
            {loja.nome}
          </motion.h1>
          <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-2xl text-base leading-8 text-texto lg:mx-0">
            {loja.descricao || "Acessórios femininos delicados, selecionados para compor momentos especiais com leveza e sofisticação."}
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            {["Acessórios selecionados", "Peças delicadas", "Atendimento pelo WhatsApp"].map((badge) => (
              <span key={badge} className="rounded-full border border-dourado/30 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-dourado">
                {badge}
              </span>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href="#produtos">
              <Button>Ver produtos</Button>
            </a>
            {whatsappUrl ? (
              <Link href={whatsappUrl} target="_blank">
                <Button variant="ghost">
                  <MessageCircle size={18} />
                  Comprar pelo WhatsApp
                </Button>
              </Link>
            ) : null}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="relative z-10">
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[42px] border border-white bg-white p-3 shadow-soft">
            {loja.capa_url ? (
              <Image src={loja.capa_url} alt={`Capa da ${loja.nome}`} fill priority className="object-cover p-3" />
            ) : (
              <div className="flex h-full flex-col justify-end rounded-[32px] bg-[linear-gradient(160deg,#FADADD,#FFFFFF_55%,#FAF7F2)] p-8">
                <Sparkles className="mb-5 text-dourado" size={42} />
                <p className="font-serif text-4xl text-preto">Detalhes que iluminam o seu estilo.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

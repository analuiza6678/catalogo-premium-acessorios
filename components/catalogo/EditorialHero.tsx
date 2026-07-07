"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export function EditorialHero({ loja }: { loja: Loja; products: Produto[] }) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Quero montar um pedido na ${loja.nome}.`);

  return (
    <section id="inicio" className="relative isolate -mt-[78px] overflow-hidden bg-[#FAF6EF]">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative min-h-[780px] w-full overflow-hidden bg-[#FAF6EF] lg:min-h-[820px]">
        <motion.div initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 z-[1] h-full w-full">
          <Image
            src="/hero-jewelry-background.png"
            alt={`Coleção ${loja.nome}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(250,246,239,0.34)_0%,rgba(250,246,239,0.22)_32%,rgba(250,246,239,0.06)_48%,rgba(250,246,239,0)_62%,rgba(250,246,239,0)_100%)]" />

        <div className="relative z-[3] flex min-h-[780px] items-start pb-[390px] pt-[160px] lg:min-h-[820px] lg:items-center lg:pb-20 lg:pt-[78px]">
          <motion.div variants={staggerContainer} className="ml-[clamp(32px,7vw,120px)] max-w-[780px] pr-6 lg:ml-[clamp(56px,7vw,120px)]">
            <motion.div variants={fadeInUp} className="mb-9 flex items-center gap-6">
              <span className="h-px w-[76px] bg-[#C9A24D]/60" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.32em] text-[#B88A2A]">
                CATÁLOGO PREMIUM
              </p>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-[clamp(52px,13vw,58px)] font-normal leading-[0.92] tracking-[-0.04em] text-[#1E1D1B] sm:text-[clamp(64px,10vw,82px)] lg:text-[clamp(72px,7.5vw,118px)]"
            >
              Sua essência
              <br />
              em cada detalhe
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-9 max-w-[600px] font-serif text-[20px] leading-8 text-[#6F6258] lg:text-[24px]">
              Acessórios femininos delicados e sofisticados.
            </motion.p>

            <motion.span variants={fadeInUp} className="mt-7 block h-px w-[110px] bg-[#C9A24D]/70" />

            <motion.div variants={fadeInUp} className="mt-11 flex flex-col gap-4 sm:flex-row">
              <a href="#produtos">
                <Button className="h-[62px] w-full min-w-[260px] rounded-[10px] bg-[linear-gradient(135deg,#D7AE4A_0%,#A87921_100%)] px-[34px] text-[15px] font-semibold text-white shadow-[0_18px_35px_rgba(168,121,33,0.22)] transition hover:-translate-y-1 hover:brightness-105 sm:w-auto">
                  Explorar coleção
                  <ArrowRight size={19} />
                </Button>
              </a>

              {whatsappUrl ? (
                <Link href={whatsappUrl} target="_blank">
                  <Button
                    variant="ghost"
                    className="h-[62px] w-full min-w-[320px] rounded-[10px] border-[#C9A24D]/70 bg-[#FAF6EF]/72 px-[34px] text-[15px] font-semibold text-[#1E1D1B] shadow-none backdrop-blur transition hover:-translate-y-1 hover:bg-[#F5EDE2] sm:w-auto"
                  >
                    <MessageCircle size={20} className="text-[#B88A2A]" />
                    Montar pedido no WhatsApp
                  </Button>
                </Link>
              ) : null}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

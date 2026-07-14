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
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Quero comprar acessórios da ${loja.nome}.`);
  const desktopCover = loja.capa_url || "/hero-jewelry-background.png";
  const mobileCover = loja.capa_mobile_url || loja.capa_url || "/hero-jewelry-background.png";

  return (
    <section id="inicio" className="relative isolate -mt-16 overflow-hidden bg-[#FAF6EF] lg:-mt-[78px]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative min-h-[520px] w-full overflow-hidden bg-[#FAF6EF] sm:min-h-[560px] lg:min-h-[820px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-[1] h-full w-full"
        >
          <Image src={mobileCover} alt={`Coleção ${loja.nome}`} fill priority quality={100} sizes="100vw" className="object-cover object-[76%_center] opacity-80 lg:hidden" />
          <Image src={desktopCover} alt={`Coleção ${loja.nome}`} fill priority quality={100} sizes="100vw" className="hidden object-cover object-top lg:block" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(250,246,239,0.86)_0%,rgba(250,246,239,0.72)_48%,rgba(250,246,239,0.22)_100%)] lg:bg-[linear-gradient(90deg,rgba(250,246,239,0.34)_0%,rgba(250,246,239,0.22)_32%,rgba(250,246,239,0.06)_48%,rgba(250,246,239,0)_62%,rgba(250,246,239,0)_100%)]" />

        <div className="relative z-[3] flex min-h-[520px] items-start px-5 pb-8 pt-24 sm:min-h-[560px] lg:min-h-[820px] lg:items-center lg:px-0 lg:pb-20 lg:pt-[78px]">
          <motion.div variants={staggerContainer} className="w-full max-w-[340px] pr-0 sm:max-w-[390px] lg:ml-[clamp(56px,7vw,120px)] lg:max-w-[780px] lg:pr-6">
            <motion.div variants={fadeInUp} className="mb-4 flex items-center gap-3 lg:mb-9 lg:gap-6">
              <span className="h-px w-10 bg-[#C9A24D]/60 lg:w-[76px]" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#B88A2A] lg:text-[13px] lg:tracking-[0.32em]">
                CATÁLOGO PREMIUM
              </p>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-[34px] font-normal leading-[0.94] tracking-[-0.035em] text-[#1E1D1B] sm:text-[40px] lg:text-[clamp(72px,7.5vw,118px)] lg:leading-[0.92] lg:tracking-[-0.04em]"
            >
              Acessórios delicados
              <br />
              para iluminar seu estilo
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-4 max-w-[270px] text-[13px] leading-5 text-[#6F6258] lg:mt-9 lg:max-w-[600px] lg:font-serif lg:text-[24px] lg:leading-8">
              Peças selecionadas para o dia a dia, presentes e composições especiais.
            </motion.p>

            <motion.span variants={fadeInUp} className="mt-4 block h-px w-16 bg-[#C9A24D]/70 lg:mt-7 lg:w-[110px]" />

            <motion.div variants={fadeInUp} className="mt-6 flex flex-col gap-2 sm:flex-row lg:mt-11 lg:gap-4">
              <a href="#produtos" className="w-full sm:w-auto">
                <Button className="h-11 w-full rounded-[10px] bg-[linear-gradient(135deg,#D7AE4A_0%,#A87921_100%)] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(168,121,33,0.18)] transition hover:brightness-105 sm:w-auto lg:h-[62px] lg:min-w-[260px] lg:px-[34px] lg:text-[15px] lg:shadow-[0_18px_35px_rgba(168,121,33,0.22)] lg:hover:-translate-y-1">
                  Ver acessórios
                  <ArrowRight size={17} className="lg:size-[19px]" />
                </Button>
              </a>

              {whatsappUrl ? (
                <Link href={whatsappUrl} target="_blank" className="w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    className="h-11 w-full rounded-[10px] border-[#C9A24D]/50 bg-[#FAF6EF]/70 px-5 text-sm font-semibold text-[#1E1D1B] shadow-none backdrop-blur transition hover:bg-[#F5EDE2] sm:w-auto lg:h-[62px] lg:min-w-[320px] lg:px-[34px] lg:text-[15px] lg:hover:-translate-y-1"
                  >
                    <MessageCircle size={17} className="text-[#B88A2A] lg:size-5" />
                    Comprar pelo WhatsApp
                  </Button>
                </Link>
              ) : null}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-4 hidden max-w-[520px] grid-cols-2 gap-2 text-[11px] font-semibold text-[#4A403A] sm:flex sm:flex-wrap lg:mt-8 lg:text-xs">
              {["Pronta entrega", "Atendimento pelo WhatsApp", "Embalagem para presente", "Peças selecionadas"].map((item) => (
                <span key={item} className="rounded-full border border-[#C9A24D]/22 bg-[#FAF6EF]/72 px-3 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

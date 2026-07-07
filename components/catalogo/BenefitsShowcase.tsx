"use client";

import { Gift, HandHeart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const benefits = [
  { icon: Sparkles, title: "Curadoria delicada", text: "Peças escolhidas pelo acabamento, brilho e versatilidade." },
  { icon: MessageCircle, title: "Compra pelo WhatsApp", text: "Envie o carrinho pronto e combine tudo diretamente com a loja." },
  { icon: Gift, title: "Kits para presente", text: "Composições prontas para surpreender com delicadeza." },
  { icon: HandHeart, title: "Atendimento próximo", text: "Uma experiência simples, cuidadosa e personalizada." }
];

export function BenefitsShowcase() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_55%,#EFE1CF_100%)] px-[22px] py-20 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[780px] rotate-[-12deg] rounded-[100%] border border-[#C9A24D]/10 bg-white/20" />
      <div className="pointer-events-none absolute right-[-140px] top-10 h-[360px] w-[360px] rounded-full bg-[#D7AE4A]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.9fr_1.25fr] lg:items-center lg:gap-[clamp(56px,7vw,110px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p variants={fadeInUp} className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A24D]">EXPERIÊNCIA BOUTIQUE</motion.p>
          <motion.h2 variants={fadeInUp} className="mt-4 max-w-[620px] font-serif text-[clamp(42px,4.5vw,72px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#1E1D1B]">
            Uma experiência pensada nos detalhes
          </motion.h2>
          <motion.span variants={fadeInUp} className="mt-7 block h-px w-28 bg-[#C9A24D]/65" />
          <motion.p variants={fadeInUp} className="mt-7 max-w-[520px] text-base leading-[1.8] text-[#6F6258]">
            Do primeiro olhar ao pedido no WhatsApp, tudo foi desenhado para valorizar a curadoria e facilitar a escolha.
          </motion.p>
        </motion.div>

        <motion.div className="grid gap-5 sm:grid-cols-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.article
                key={benefit.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-[24px] border border-[#C9A24D]/18 bg-white/58 p-6 shadow-[0_22px_60px_rgba(80,55,25,0.08)] backdrop-blur-xl transition hover:border-[#C9A24D]/35 hover:shadow-[0_30px_80px_rgba(80,55,25,0.12)] lg:p-8"
              >
                <div className="mb-6 grid size-12 place-items-center rounded-full bg-[linear-gradient(135deg,#F4D892_0%,#D7AE4A_100%)] text-[#4A3320] shadow-[0_10px_24px_rgba(168,121,33,0.18)]">
                  <Icon size={21} strokeWidth={1.55} />
                </div>
                <h3 className="font-serif text-[28px] font-medium leading-[1.1] text-[#1E1D1B]">{benefit.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[#6F6258]">{benefit.text}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

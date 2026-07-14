"use client";

import { Gift, HandHeart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const benefits = [
  { icon: Sparkles, title: "Curadoria delicada", text: "Peças escolhidas pelo acabamento, brilho e versatilidade." },
  { icon: MessageCircle, title: "Compra pelo WhatsApp", text: "Envie sua sacola pronta e combine tudo diretamente com a loja." },
  { icon: Gift, title: "Kits para presente", text: "Composições prontas para surpreender com delicadeza." },
  { icon: HandHeart, title: "Atendimento próximo", text: "Uma experiência simples, cuidadosa e personalizada." }
];

export function BenefitsShowcase() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_55%,#EFE1CF_100%)] px-5 py-12 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[780px] rotate-[-12deg] rounded-[100%] border border-[#C9A24D]/10 bg-white/20" />
      <div className="pointer-events-none absolute right-[-140px] top-10 h-[360px] w-[360px] rounded-full bg-[#D7AE4A]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.9fr_1.25fr] lg:items-center lg:gap-[clamp(56px,7vw,110px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.p variants={fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A24D] lg:text-xs lg:tracking-[0.28em]">EXPERIÊNCIA BOUTIQUE</motion.p>
          <motion.h2 variants={fadeInUp} className="mt-3 max-w-[360px] font-serif text-[30px] font-normal leading-[1] tracking-[-0.03em] text-[#1E1D1B] lg:mt-4 lg:max-w-[620px] lg:text-[clamp(42px,4.5vw,72px)] lg:leading-[0.98] lg:tracking-[-0.035em]">
            Uma experiência pensada nos detalhes
          </motion.h2>
          <motion.span variants={fadeInUp} className="mt-4 block h-px w-20 bg-[#C9A24D]/65 lg:mt-7 lg:w-28" />
          <motion.p variants={fadeInUp} className="mt-4 max-w-[330px] text-sm leading-6 text-[#6F6258] lg:mt-7 lg:max-w-[520px] lg:text-base lg:leading-[1.8]">
            Curadoria, atendimento e pedido pelo WhatsApp em uma experiência simples.
          </motion.p>
        </motion.div>

        <motion.div className="grid gap-3 sm:grid-cols-2 lg:gap-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.article
                key={benefit.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-[18px] border border-[#C9A24D]/16 bg-white/58 p-4 shadow-[0_12px_30px_rgba(80,55,25,0.06)] backdrop-blur-xl transition hover:border-[#C9A24D]/35 hover:shadow-[0_30px_80px_rgba(80,55,25,0.12)] lg:rounded-[24px] lg:p-8 lg:shadow-[0_22px_60px_rgba(80,55,25,0.08)]"
              >
                <div className="mb-3 grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#F4D892_0%,#D7AE4A_100%)] text-[#4A3320] shadow-[0_8px_18px_rgba(168,121,33,0.14)] lg:mb-6 lg:size-12 lg:shadow-[0_10px_24px_rgba(168,121,33,0.18)]">
                  <Icon size={17} strokeWidth={1.55} className="lg:size-[21px]" />
                </div>
                <h3 className="font-serif text-[21px] font-medium leading-[1.08] text-[#1E1D1B] lg:text-[28px]">{benefit.title}</h3>
                <p className="mt-2 text-[13px] leading-5 text-[#6F6258] lg:mt-3 lg:text-[15px] lg:leading-[1.65]">{benefit.text}</p>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div variants={fadeInUp} className="rounded-[20px] border border-[#C9A24D]/16 bg-white/54 p-4 shadow-[0_12px_30px_rgba(80,55,25,0.06)] backdrop-blur-xl lg:col-span-2 lg:rounded-[28px] lg:p-7 lg:shadow-[0_22px_60px_rgba(80,55,25,0.08)]">
          <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A24D] lg:text-xs lg:tracking-[0.24em]">Como comprar</p>
              <h3 className="mt-1 font-serif text-2xl leading-none text-[#1E1D1B] lg:mt-2 lg:text-3xl">Comprar é simples</h3>
              <p className="mt-2 text-xs leading-5 text-[#6F6258] lg:mt-3 lg:text-sm lg:leading-6">Escolha, adicione à sacola e finalize pelo WhatsApp.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
              {["Escolha as peças", "Adicione ao pedido", "Finalize no WhatsApp", "Combine entrega"].map((step, index) => (
                <div key={step} className="rounded-xl bg-[#FAF6EF]/80 px-3 py-2 text-xs font-semibold leading-4 text-[#1E1D1B] lg:rounded-2xl lg:px-4 lg:py-3 lg:text-sm">
                  <span className="mb-1.5 grid size-6 place-items-center rounded-full bg-[#C9A24D] text-[10px] text-white lg:mb-2 lg:size-7 lg:text-xs">{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

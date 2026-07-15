"use client";

import { Gift, HandHeart, MessageCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { StoreSectionContent } from "@/types/store-section";
import { defaultSectionContent } from "@/types/store-section";

const icons: Record<string, LucideIcon> = {
  Sparkles,
  MessageCircle,
  Gift,
  HandHeart
};

export function BenefitsShowcase({
  benefitsContent,
  howToBuyContent,
  showBenefits = true,
  showHowToBuy = true
}: {
  benefitsContent?: StoreSectionContent;
  howToBuyContent?: StoreSectionContent;
  showBenefits?: boolean;
  showHowToBuy?: boolean;
}) {
  const benefitsSection = { ...defaultSectionContent.benefits, ...benefitsContent };
  const howToBuySection = { ...defaultSectionContent.how_to_buy, ...howToBuyContent };
  const benefits = benefitsSection.items?.filter((item) => item.enabled !== false) ?? [];
  const steps = howToBuySection.items?.filter((item) => item.enabled !== false) ?? [];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--store-background)_0%,color-mix(in_srgb,var(--store-background)_76%,var(--store-secondary))_55%,color-mix(in_srgb,var(--store-background)_70%,var(--store-primary))_100%)] px-5 py-12 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[780px] rotate-[-12deg] rounded-[100%] border border-[var(--store-border)] bg-white/20" />
      <div className="pointer-events-none absolute right-[-140px] top-10 h-[360px] w-[360px] rounded-full bg-[var(--store-primary)]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.9fr_1.25fr] lg:items-center lg:gap-[clamp(56px,7vw,110px)]">
        {showBenefits ? (
          <>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeInUp} className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--store-primary)] lg:text-xs lg:tracking-[0.28em]">
                {benefitsSection.eyebrow}
              </motion.p>
              <motion.h2 variants={fadeInUp} className="mt-3 max-w-[360px] font-serif text-[30px] font-normal leading-[1] tracking-[-0.03em] text-[var(--store-text)] lg:mt-4 lg:max-w-[620px] lg:text-[clamp(42px,4.5vw,72px)] lg:leading-[0.98] lg:tracking-[-0.035em]">
                {benefitsSection.title}
              </motion.h2>
              <motion.span variants={fadeInUp} className="mt-4 block h-px w-20 bg-[var(--store-primary)]/65 lg:mt-7 lg:w-28" />
              <motion.p variants={fadeInUp} className="mt-4 max-w-[330px] text-sm leading-6 text-[var(--store-muted)] lg:mt-7 lg:max-w-[520px] lg:text-base lg:leading-[1.8]">
                {benefitsSection.description}
              </motion.p>
            </motion.div>

            <motion.div className="grid gap-3 sm:grid-cols-2 lg:gap-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {benefits.map((benefit) => {
                const Icon = icons[benefit.icon ?? "Sparkles"] ?? Sparkles;
                return (
                  <motion.article
                    key={benefit.title}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    className="rounded-[18px] border border-[var(--store-border)] bg-white/58 p-4 shadow-[0_12px_30px_rgba(80,55,25,0.06)] backdrop-blur-xl transition hover:shadow-[0_30px_80px_rgba(80,55,25,0.12)] lg:rounded-[24px] lg:p-8 lg:shadow-[0_22px_60px_rgba(80,55,25,0.08)]"
                  >
                    <div className="mb-3 grid size-9 place-items-center rounded-full bg-[var(--store-primary)] text-[var(--store-button-text)] shadow-[0_8px_18px_rgba(168,121,33,0.14)] lg:mb-6 lg:size-12">
                      <Icon size={17} strokeWidth={1.55} className="lg:size-[21px]" />
                    </div>
                    <h3 className="font-serif text-[21px] font-medium leading-[1.08] text-[var(--store-text)] lg:text-[28px]">{benefit.title}</h3>
                    {benefit.text ? <p className="mt-2 text-[13px] leading-5 text-[var(--store-muted)] lg:mt-3 lg:text-[15px] lg:leading-[1.65]">{benefit.text}</p> : null}
                  </motion.article>
                );
              })}
            </motion.div>
          </>
        ) : null}

        {showHowToBuy ? (
          <motion.div variants={fadeInUp} className={`${showBenefits ? "lg:col-span-2" : ""} rounded-[20px] border border-[var(--store-border)] bg-white/54 p-4 shadow-[0_12px_30px_rgba(80,55,25,0.06)] backdrop-blur-xl lg:rounded-[28px] lg:p-7 lg:shadow-[0_22px_60px_rgba(80,55,25,0.08)]`}>
            <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--store-primary)] lg:text-xs lg:tracking-[0.24em]">{howToBuySection.eyebrow}</p>
                <h3 className="mt-1 font-serif text-2xl leading-none text-[var(--store-text)] lg:mt-2 lg:text-3xl">{howToBuySection.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--store-muted)] lg:mt-3 lg:text-sm lg:leading-6">{howToBuySection.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
                {steps.map((step, index) => (
                  <div key={step.title} className="rounded-xl bg-[var(--store-background)]/80 px-3 py-2 text-xs font-semibold leading-4 text-[var(--store-text)] lg:rounded-2xl lg:px-4 lg:py-3 lg:text-sm">
                    <span className="mb-1.5 grid size-6 place-items-center rounded-full bg-[var(--store-primary)] text-[10px] text-[var(--store-button-text)] lg:mb-2 lg:size-7 lg:text-xs">{index + 1}</span>
                    {step.title}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

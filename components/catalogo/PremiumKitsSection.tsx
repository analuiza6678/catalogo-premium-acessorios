"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Produto } from "@/types/produto";

export function PremiumKitsSection({
  lojaSlug,
  kits,
  preview,
  whatsapp
}: {
  lojaSlug: string;
  kits: Produto[];
  preview?: boolean;
  whatsapp?: string | null;
}) {
  const kit = kits[0];
  const shouldShowFallbackKit = Boolean(preview);
  const price = kit ? kit.preco_promocional ?? kit.preco : shouldShowFallbackKit ? 149.9 : null;
  const oldPrice = kit?.preco_promocional ? kit.preco : shouldShowFallbackKit ? 189.9 : null;
  const whatsappUrl = buildWhatsappUrl(whatsapp, "Ola! Quero montar um kit especial.");

  return (
    <section id="kits" className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_18%,rgba(215,174,74,0.10),transparent_30%),radial-gradient(circle_at_88%_42%,rgba(232,205,168,0.35),transparent_34%),linear-gradient(135deg,#FAF6EF_0%,#F7EFE8_48%,#EFE1CF_100%)] px-[22px] py-20 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute right-[-180px] top-20 h-[620px] w-[620px] rounded-full bg-white/20" />
      <div className="pointer-events-none absolute right-[12%] top-[24%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(215,174,74,0.22),transparent_65%)] blur-xl" />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative mx-auto grid max-w-[1400px] gap-12 lg:min-h-[640px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-[clamp(56px,7vw,110px)]">
        <div>
          <motion.p variants={fadeInUp} className="text-xs font-bold uppercase tracking-[0.30em] text-[#C9A24D]">COMPOSICOES PRONTAS</motion.p>
          <motion.h2 variants={fadeInUp} className="mt-4 font-serif text-[clamp(44px,5vw,82px)] font-normal leading-[0.95] tracking-[-0.04em] text-[#1E1D1B]">
            Kits Especiais
          </motion.h2>
          <motion.span variants={fadeInUp} className="mt-7 block h-px w-28 bg-[#C9A24D]/65" />
          <motion.p variants={fadeInUp} className="mt-7 max-w-[520px] text-[17px] leading-[1.8] text-[#6F6258]">
            Kits com combinacoes pensadas para presente, producoes completas e finalizacao pelo WhatsApp.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 max-w-[460px] rounded-[24px] border border-[#C9A24D]/18 bg-white/55 p-6 shadow-[0_22px_60px_rgba(80,55,25,0.08)] backdrop-blur-xl lg:p-7">
            {["Ideal para presente", "Combinacao pronta", "Finalizacao pelo WhatsApp"].map((item) => (
              <p key={item} className="flex items-center gap-4 py-2.5 text-[15px] font-semibold text-[#1E1D1B]">
                <span className="grid size-7 place-items-center rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] text-white shadow-[0_8px_18px_rgba(168,121,33,0.18)]">
                  <Check size={15} />
                </span>
                {item}
              </p>
            ))}
          </motion.div>

          {whatsappUrl ? (
            <motion.div variants={fadeInUp} className="mt-7">
              <Link href={whatsappUrl} target="_blank" className="inline-flex h-[58px] items-center gap-3 rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-8 font-bold text-white shadow-[0_18px_40px_rgba(168,121,33,0.22)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(168,121,33,0.30)] max-sm:w-full max-sm:justify-center">
                <MessageCircle size={19} />
                Montar kit no WhatsApp
              </Link>
            </motion.div>
          ) : null}
        </div>

        <motion.div variants={fadeInUp} className="relative flex items-center justify-center">
          <span className="absolute -left-2 top-8 hidden rounded-full border border-[#C9A24D]/18 bg-white/66 px-5 py-3 text-[13px] text-[#6F6258] shadow-[0_16px_35px_rgba(80,55,25,0.08)] backdrop-blur lg:block">
            Pronto para presentear
          </span>
          <span className="absolute bottom-16 right-4 hidden rounded-full border border-[#C9A24D]/18 bg-white/66 px-5 py-3 text-[13px] text-[#6F6258] shadow-[0_16px_35px_rgba(80,55,25,0.08)] backdrop-blur lg:block">
            Compra rapida pelo WhatsApp
          </span>

          {kit || shouldShowFallbackKit ? (
            <article className="relative z-10 w-full max-w-[440px] rounded-[32px] border border-[#C9A24D]/20 bg-white/78 p-[18px] shadow-[0_34px_90px_rgba(80,55,25,0.16)]">
              <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#EADBC8]">
                <Image
                  src={kit?.imagem_url || "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=90&w=1400&auto=format&fit=crop"}
                  alt={kit?.nome || "Kit Essencial Dourado"}
                  fill
                  sizes="(min-width: 1024px) 440px, 90vw"
                  className="object-cover sepia-[0.08] saturate-105 brightness-105"
                />
                <span className="absolute left-5 top-5 rounded-full border border-[#C9A24D]/25 bg-white/90 px-3 py-1.5 text-xs font-bold text-[#A87921]">Kit especial</span>
              </div>
              <div className="px-2 pb-1 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A24D]">KITS</p>
                <Link href={kit ? `/${lojaSlug}/shop/produto/${kit.slug}` : `/${lojaSlug}/shop`} className="mt-2 block font-serif text-[32px] leading-[1.05] text-[#1E1D1B]">
                  {kit?.nome || "Kit Essencial Dourado"}
                </Link>
                <p className="mt-3 text-[15px] leading-[1.55] text-[#6F6258]">{kit?.descricao || "Conjunto completo com pecas versateis para o dia a dia."}</p>
                {price ? (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-[22px] font-extrabold text-[#A87921]">{formatPrice(price)}</span>
                    {oldPrice ? <span className="text-sm text-[#AAA098] line-through">{formatPrice(oldPrice)}</span> : null}
                  </div>
                ) : null}
              </div>
            </article>
          ) : (
            <div className="relative z-10 w-full max-w-[440px] rounded-[32px] border border-[#C9A24D]/20 bg-white/70 p-10 text-center shadow-[0_28px_80px_rgba(80,55,25,0.10)] backdrop-blur">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320]">
                <PackageOpen size={28} strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-serif text-4xl leading-none text-[#1E1D1B]">Kits em breve</h3>
              <p className="mt-4 text-sm leading-6 text-[#6F6258]">A loja ainda esta preparando combinacoes especiais para presentear.</p>
              {whatsappUrl ? (
                <Link href={whatsappUrl} target="_blank" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-6 text-sm font-bold text-white">
                  Falar com a loja
                </Link>
              ) : null}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

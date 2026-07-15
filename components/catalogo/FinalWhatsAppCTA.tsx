"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import type { StoreSectionContent } from "@/types/store-section";
import { defaultSectionContent } from "@/types/store-section";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

export function FinalWhatsAppCTA({ loja, content }: { loja: Loja; content?: StoreSectionContent }) {
  const section = { ...defaultSectionContent.final_cta, ...content };
  const url = buildWhatsappUrl(loja.whatsapp, `Olá! Gostei das peças da ${loja.nome}.`);
  const steps = section.items?.filter((item) => item.enabled !== false) ?? [
    { title: "Escolha os produtos" },
    { title: "Adicione à sacola" },
    { title: "Finalize no WhatsApp" }
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--store-secondary),var(--store-background)_45%,var(--store-primary)_150%)] px-4 py-16 lg:py-24">
      <div className="absolute left-1/2 top-0 h-48 w-[680px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      <div className="relative mx-auto max-w-5xl rounded-[32px] border border-white/75 bg-white/62 p-7 text-center shadow-[0_32px_110px_rgba(58,42,36,0.13)] backdrop-blur-xl sm:p-10 lg:rounded-[48px]">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--store-primary)]">{section.eyebrow}</p>
        <h2 className="mt-3 font-serif text-[34px] leading-tight text-[var(--store-text)] lg:text-5xl">{section.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--store-muted)] lg:leading-8">{section.description}</p>
        <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[20px] bg-white/70 px-4 py-4 text-sm font-bold text-[var(--store-text)] lg:rounded-[24px]">
              <span className="mb-2 inline-grid size-8 place-items-center rounded-full bg-[var(--store-primary)] text-[var(--store-button-text)]">{index + 1}</span>
              <p>{step.title}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={() => window.dispatchEvent(new Event("open-cart"))}>
            <ShoppingBag size={18} />
            {section.primaryButtonText}
          </Button>
          {url ? (
            <Link href={url} target="_blank">
              <Button>
                <MessageCircle size={18} />
                {section.whatsappButtonText}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

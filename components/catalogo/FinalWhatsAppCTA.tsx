"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

export function FinalWhatsAppCTA({ loja }: { loja: Loja }) {
  const url = buildWhatsappUrl(loja.whatsapp, `Olá! Gostei das peças da ${loja.nome}.`);
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F8DDEB,#FAF3E8_45%,#E8C766_150%)] px-4 py-24">
      <div className="absolute left-1/2 top-0 h-48 w-[680px] -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      <div className="relative mx-auto max-w-5xl rounded-[48px] border border-white/75 bg-white/62 p-8 text-center shadow-[0_32px_110px_rgba(58,42,36,0.13)] backdrop-blur-xl sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#C9A227]">Pedido simples</p>
        <h2 className="mt-3 font-serif text-5xl leading-tight text-[#1E1A18]">Gostou de alguma peça?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#665b55]">Monte seu pedido na sacola ou fale diretamente com a loja pelo WhatsApp.</p>
        <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
          {["Escolha os produtos", "Adicione à sacola", "Finalize no WhatsApp"].map((step, index) => (
            <div key={step} className="rounded-[24px] bg-white/70 px-4 py-4 text-sm font-bold text-[#3A2A24]">
              <span className="mb-2 inline-grid size-8 place-items-center rounded-full bg-[#C9A227] text-white">{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={() => window.dispatchEvent(new Event("open-cart"))}>
            <ShoppingBag size={18} />
            Ver sacola
          </Button>
          {url ? <Link href={url} target="_blank"><Button><MessageCircle size={18} /> Falar no WhatsApp</Button></Link> : null}
        </div>
      </div>
    </section>
  );
}

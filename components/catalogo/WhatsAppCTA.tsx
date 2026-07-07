"use client";

import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

export function WhatsAppCTA({ loja }: { loja: Loja }) {
  const url = buildWhatsappUrl(loja.whatsapp, `Ola! Gostei das pecas da ${loja.nome}.`);
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F8DDEB,#FFFFFF_55%,#E8C766_160%)] py-16">
      <div className="absolute left-8 top-8 size-24 rounded-full bg-white/50 blur-2xl" />
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-[40px] border border-white bg-white/72 p-8 shadow-soft backdrop-blur">
          <h2 className="font-serif text-4xl text-preto sm:text-5xl">Gostou de alguma peca?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-texto">Monte seu pedido no carrinho ou fale diretamente com a loja pelo WhatsApp.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => window.dispatchEvent(new Event("open-cart"))}>
              <ShoppingBag size={18} />
              Ver carrinho
            </Button>
            {url ? <Link href={url} target="_blank"><Button><MessageCircle size={18} /> Falar no WhatsApp</Button></Link> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

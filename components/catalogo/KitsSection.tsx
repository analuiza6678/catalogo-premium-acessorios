"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import type { Produto } from "@/types/produto";
import { Button } from "@/components/ui/Button";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { PremiumProductCard } from "./PremiumProductCard";

type KitsSectionProps = {
  lojaSlug: string;
  whatsapp: string | null;
  kits: Produto[];
  preview?: boolean;
};

export function KitsSection({ lojaSlug, whatsapp, kits, preview }: KitsSectionProps) {
  const url = buildWhatsappUrl(whatsapp, "Olá! Quero montar um kit especial com a loja.");

  return (
    <section id="kits" className="bg-rosa-bebe/35 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-4xl text-preto sm:text-5xl">Kits Especiais</h2>
            <p className="mt-3 max-w-2xl leading-7 text-texto">Combinacoes prontas para presentear ou montar um visual completo.</p>
          </div>
          {url ? (
            <Link href={url} target="_blank">
              <Button variant="ghost">
                <Gift size={18} />
                Monte seu kit pelo WhatsApp
              </Button>
            </Link>
          ) : null}
        </div>

        {kits.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {kits.slice(0, 4).map((kit) => (
              <PremiumProductCard key={kit.id} lojaSlug={lojaSlug} produto={kit} preview={preview} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-[34px] border border-dourado/20 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-rosa-bebe text-dourado">
              <Gift size={26} />
            </div>
            <h3 className="font-serif text-3xl text-preto">Monte seu kit pelo WhatsApp</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-texto">A loja pode sugerir combinações personalizadas para presente, ocasião especial ou uso diário.</p>
            {url ? <Link href={url} target="_blank"><Button className="mt-6">Falar com a loja</Button></Link> : null}
          </div>
        )}
      </div>
    </section>
  );
}

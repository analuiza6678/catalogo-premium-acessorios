"use client";

import type { Produto } from "@/types/produto";
import { PremiumProductCard } from "./PremiumProductCard";
import { AnimatedReveal } from "./AnimatedReveal";

export function FeaturedShowcase({ lojaSlug, products, preview }: { lojaSlug: string; products: Produto[]; preview?: boolean }) {
  const [first, ...rest] = products;
  if (!first) return null;

  return (
    <AnimatedReveal className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#C9A227]">Peças mais desejadas</p>
          <h2 className="mt-3 font-serif text-5xl text-[#1E1A18]">Destaques da Coleção</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#76675f]">Uma vitrine com peças que carregam brilho, delicadeza e presença sem exagero.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        <PremiumProductCard lojaSlug={lojaSlug} produto={first} preview={preview} />
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.slice(0, 4).map((product) => (
            <PremiumProductCard key={product.id} lojaSlug={lojaSlug} produto={product} preview={preview} compact />
          ))}
        </div>
      </div>
    </AnimatedReveal>
  );
}

"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/utils/motion";
import type { Produto } from "@/types/produto";
import { PremiumProductCard } from "./PremiumProductCard";
import { PremiumEmptyState } from "./PremiumEmptyState";

type FeaturedProductsProps = {
  lojaSlug: string;
  whatsapp: string | null;
  produtos: Produto[];
  preview?: boolean;
};

export function FeaturedProducts({ lojaSlug, whatsapp, produtos, preview }: FeaturedProductsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-7 max-w-2xl">
        <h2 className="font-serif text-4xl text-preto sm:text-5xl">Destaques da Colecao</h2>
        <p className="mt-3 leading-7 text-texto">Pecas escolhidas para deixar seu estilo ainda mais delicado.</p>
      </div>
      {produtos.length ? (
        <motion.div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {produtos.slice(0, 6).map((produto) => (
            <motion.div key={produto.id} variants={fadeInUp}>
              <PremiumProductCard lojaSlug={lojaSlug} produto={produto} preview={preview} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <PremiumEmptyState whatsapp={whatsapp} title="Destaques em breve" text="A colecao ainda esta sendo preparada, mas voce ja pode falar com a loja para receber novidades." />
      )}
    </section>
  );
}

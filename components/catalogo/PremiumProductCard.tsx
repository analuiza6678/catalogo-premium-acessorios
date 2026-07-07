"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { hoverLift } from "@/lib/utils/motion";
import type { Produto } from "@/types/produto";

type PremiumProductCardProps = {
  lojaSlug: string;
  produto: Produto;
  preview?: boolean;
  compact?: boolean;
};

export function PremiumProductCard({ lojaSlug, produto, preview, compact }: PremiumProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const price = produto.preco_promocional ?? produto.preco;
  const isKit = produto.tipo_produto === "kit";
  const badge = produto.badge || (isKit ? "Kit" : produto.destaque ? "Destaque" : null);

  function addToCart() {
    addItem({ id: produto.id, nome: produto.nome, slug: produto.slug, preco: price, imagem_url: produto.imagem_url });
    toast.success(preview ? "Produto de exemplo adicionado ao carrinho." : "Produto adicionado ao carrinho.");
  }

  return (
    <motion.article whileHover={hoverLift} className={`group overflow-hidden rounded-[34px] border border-white/80 bg-white/80 p-3 shadow-[0_24px_75px_rgba(58,42,36,0.10)] backdrop-blur ${isKit ? "bg-[#F8DDEB]/45" : ""}`}>
      <div className={`relative overflow-hidden rounded-[28px] bg-[#FAF3E8] ${compact ? "aspect-[5/4]" : "aspect-[4/5]"}`}>
        {produto.imagem_url ? (
          <Image src={produto.imagem_url} alt={produto.nome} fill className="object-cover transition duration-700 group-hover:scale-110" />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#F8DDEB,#FAF7F2)] text-dourado">
            <Sparkles size={34} />
          </div>
        )}
        {badge ? (
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2.8, repeat: Infinity }} className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#C9A227] shadow">
            {badge}
          </motion.span>
        ) : null}
        <button className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/80 text-[#3A2A24] shadow backdrop-blur" aria-label="Favoritar visual">
          <Heart size={17} />
        </button>
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid gap-2 rounded-[22px] bg-white/86 p-2 shadow-[0_18px_50px_rgba(58,42,36,0.16)] backdrop-blur sm:grid-cols-2">
            {preview ? (
              <Button variant="ghost" className="min-h-10 w-full px-3" onClick={() => toast("Este e um produto de exemplo para visualizar o catalogo.")}>
                <Eye size={16} />
                Ver
              </Button>
            ) : (
              <Link href={`/${lojaSlug}/shop/produto/${produto.slug}`}>
                <Button variant="ghost" className="min-h-10 w-full px-3">
                  <Eye size={16} />
                  Ver
                </Button>
              </Link>
            )}
            <Button className="min-h-10 w-full px-3" onClick={addToCart}>
              <ShoppingBag size={16} />
              Adicionar
            </Button>
          </div>
        </div>
      </div>
      <div className="px-1 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">{produto.categorias?.nome ?? (isKit ? "Kit especial" : "Acessorio")}</p>
        <h3 className="mt-2 font-serif text-2xl leading-7 text-[#1E1A18]">{produto.nome}</h3>
        {produto.descricao ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#76675f]">{produto.descricao}</p> : null}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#C9A227]">{formatPrice(price)}</span>
          {produto.preco_promocional ? <span className="text-sm text-[#76675f]/45 line-through">{formatPrice(produto.preco)}</span> : null}
        </div>
      </div>
    </motion.article>
  );
}

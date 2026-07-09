"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { hasPromo, isOutOfStock, productDescription, productName, productPrice } from "@/lib/catalog/productDisplay";
import type { Produto } from "@/types/produto";

type ProductCardProps = {
  lojaSlug: string;
  produto: Produto;
  large?: boolean;
};

export function ProductCard({ lojaSlug, produto, large }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const price = productPrice(produto);
  const addToCart = () => {
    if (process.env.NODE_ENV === "production" && produto.id.startsWith("mock-")) return;
    if (isOutOfStock(produto)) return;
    addItem({ id: produto.id, nome: productName(produto.nome), slug: produto.slug, preco: price, imagem_url: produto.imagem_url });
  };

  return (
    <article className="group animate-fadeUp overflow-hidden rounded-[26px] border border-rosa-bebe/70 bg-white p-3 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-gold">
      <Link href={`/${lojaSlug}/shop/produto/${produto.slug}`} className={`relative block overflow-hidden rounded-[20px] bg-bege ${large ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
        {produto.imagem_url ? (
          <Image src={produto.imagem_url} alt={productName(produto.nome)} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-rosa-bebe text-sm text-texto">Sem imagem</div>
        )}
      </Link>
      <div className="px-1 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dourado">{produto.categorias?.nome ?? "Acessório"}</p>
        <h3 className="mt-2 min-h-12 font-serif text-2xl leading-6 text-preto">{productName(produto.nome)}</h3>
        {productDescription(produto) ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-texto">{productDescription(produto)}</p> : null}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-dourado">{formatPrice(price)}</span>
          {hasPromo(produto) ? <span className="text-sm text-texto/50 line-through">{formatPrice(produto.preco)}</span> : null}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href={`/${lojaSlug}/shop/produto/${produto.slug}`}>
            <Button variant="ghost" className="w-full">
              <Eye size={16} />
              Ver detalhes
            </Button>
          </Link>
          <Button
            className="w-full"
            onClick={addToCart}
            disabled={isOutOfStock(produto)}
          >
            <ShoppingBag size={16} />
            {isOutOfStock(produto) ? "Esgotado" : "Adicionar"}
          </Button>
        </div>
      </div>
    </article>
  );
}

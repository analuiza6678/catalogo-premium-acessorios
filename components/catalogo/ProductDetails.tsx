"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";
import { QuantitySelector } from "./QuantitySelector";
import { WhatsAppCheckoutButton } from "./WhatsAppCheckoutButton";

type ProductDetailsProps = {
  loja: Loja;
  produto: Produto;
};

export function ProductDetails({ loja, produto }: ProductDetailsProps) {
  const images = [produto.imagem_url, ...(produto.galeria_urls ?? [])].filter(Boolean) as string[];
  const [selectedImage, setSelectedImage] = useState(images[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const price = produto.preco_promocional ?? produto.preco;

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-bege shadow-soft">
          {selectedImage ? <Image src={selectedImage} alt={produto.nome} fill priority unoptimized sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" /> : null}
        </div>
        {images.length > 1 ? (
          <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto">
            {images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${selectedImage === image ? "border-dourado" : "border-rosa-bebe"}`}
              >
                <Image src={image} alt={produto.nome} fill unoptimized sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="lg:pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dourado">{produto.categorias?.nome ?? loja.nome}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-preto sm:text-6xl">{produto.nome}</h1>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-dourado">{formatPrice(price)}</span>
          {produto.preco_promocional ? <span className="text-base text-texto/50 line-through">{formatPrice(produto.preco)}</span> : null}
        </div>
        {produto.descricao ? <p className="mt-6 text-base leading-8 text-texto">{produto.descricao}</p> : null}
        {produto.detalhes ? (
          <div className="mt-6 rounded-[24px] bg-bege p-5">
            <h2 className="font-serif text-2xl text-preto">Detalhes</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-texto">{produto.detalhes}</p>
          </div>
        ) : null}
        <div className="mt-8 flex items-center gap-4">
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => addItem({ id: produto.id, nome: produto.nome, slug: produto.slug, preco: price, imagem_url: produto.imagem_url }, quantity)}
            className="w-full"
          >
            <ShoppingBag size={18} />
            Adicionar ao carrinho
          </Button>
          <WhatsAppCheckoutButton whatsapp={loja.whatsapp} produto={produto} lojaId={loja.id} />
        </div>
      </div>
    </section>
  );
}

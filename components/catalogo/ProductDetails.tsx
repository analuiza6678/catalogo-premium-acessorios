"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cleanText, hasPromo, isLowStock, isOutOfStock, productDescription, productDetails, productName, productPrice, technicalDetails } from "@/lib/catalog/productDisplay";
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
  const price = productPrice(produto);
  const details = productDetails(produto);
  const description = productDescription(produto);
  const specs = technicalDetails(produto);
  const care = cleanText(produto.cuidados) || "Para preservar o brilho da sua peça, evite contato com água, perfume, cremes e produtos químicos. Guarde em local seco e separado de outras peças.";

  function addToOrder() {
    if (isOutOfStock(produto)) {
      toast.error("Este produto está esgotado no momento.");
      return;
    }
    addItem({ id: produto.id, nome: productName(produto.nome), slug: produto.slug, preco: price, imagem_url: produto.imagem_url }, quantity);
    toast.success("Produto adicionado ao pedido.");
    window.dispatchEvent(new Event("open-cart"));
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-bege shadow-soft">
          {selectedImage ? <Image src={selectedImage} alt={produto.nome} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" /> : null}
        </div>
        {images.length > 1 ? (
          <div className="scrollbar-none mt-4 flex gap-3 overflow-x-auto">
            {images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${selectedImage === image ? "border-dourado" : "border-rosa-bebe"}`}
              >
                <Image src={image} alt={produto.nome} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="lg:pt-8">
        <Link href={`/${loja.slug}/shop`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-texto transition hover:text-dourado">
          <ArrowLeft size={16} />
          Voltar ao catálogo
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-dourado">{produto.categorias?.nome ?? loja.nome}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-preto sm:text-6xl">{productName(produto.nome)}</h1>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-dourado">{formatPrice(price)}</span>
          {hasPromo(produto) ? <span className="text-base text-texto/50 line-through">{formatPrice(produto.preco)}</span> : null}
        </div>
        <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${isOutOfStock(produto) ? "bg-red-50 text-red-700" : isLowStock(produto) ? "bg-amber-50 text-amber-700" : "bg-bege text-texto"}`}>
          {isOutOfStock(produto) ? "Produto esgotado" : isLowStock(produto) ? "Últimas unidades" : "Pronta entrega"}
        </p>
        {description ? <p className="mt-6 text-base leading-8 text-texto">{description}</p> : null}
        {details ? (
          <div className="mt-6 rounded-[24px] bg-bege p-5">
            <h2 className="font-serif text-2xl text-preto">Sobre a peça</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-texto">{details}</p>
          </div>
        ) : null}
        {specs.length ? (
          <div className="mt-6 rounded-[24px] border border-rosa-bebe/70 bg-white p-5">
            <h2 className="font-serif text-2xl text-preto">Detalhes técnicos</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {specs.map((item) => (
                <div key={item.label} className="rounded-2xl bg-bege px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-dourado">{item.label}</dt>
                  <dd className="mt-1 text-sm text-preto">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <div className="mt-6 rounded-[24px] border border-dourado/15 bg-[#FAF6EF] p-5">
          <h2 className="flex items-center gap-2 font-serif text-2xl text-preto"><CheckCircle2 size={20} className="text-dourado" /> Cuidados com a peça</h2>
          <p className="mt-2 text-sm leading-7 text-texto">{care}</p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button
            onClick={addToOrder}
            disabled={isOutOfStock(produto)}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={18} />
            {isOutOfStock(produto) ? "Produto esgotado" : "Adicionar ao pedido"}
          </Button>
          <WhatsAppCheckoutButton whatsapp={loja.whatsapp} produto={produto} lojaId={loja.id} />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Diamond, Eye, Gift, MessageCircle, Search, ShoppingBag, SlidersHorizontal, Truck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { hasPromo, isLowStock, isOutOfStock, productBadge, productDescription, productName, productPrice } from "@/lib/catalog/productDisplay";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";

type ProductCatalogSectionProps = {
  lojaSlug: string;
  categories: Categoria[];
  products: Produto[];
  preview?: boolean;
  whatsapp?: string | null;
};

const benefits = [
  { title: "Peças com garantia", text: "Qualidade e acabamento premium", icon: Diamond },
  { title: "Embalagem especial", text: "Pronta para presentear", icon: Gift },
  { title: "Envio seguro", text: "Para todo o Brasil", icon: Truck },
  { title: "Atendimento humanizado", text: "Estamos aqui para você", icon: BadgeCheck }
];

export function ProductCatalogSection({ lojaSlug, categories, products, preview, whatsapp }: ProductCatalogSectionProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [order, setOrder] = useState("recentes");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const whatsappUrl = buildWhatsappUrl(whatsapp, "Olá! Quero saber quando novas peças estarão disponíveis.");
  const hasProducts = products.length > 0;
  const visibleCategoryIds = useMemo(() => new Set(products.map((product) => product.categoria_id).filter((id): id is string => Boolean(id))), [products]);
  const visibleCategories = useMemo(() => categories.filter((item) => visibleCategoryIds.has(item.id)), [categories, visibleCategoryIds]);

  const filtered = useMemo(() => {
    return [...products]
      .filter((product) => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        return [product.nome, product.descricao, product.material, product.banho_cor, product.ocasiao, product.tags?.join(" ")]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      })
      .filter((product) => (category ? product.categoria_id === category || product.categorias?.id === category : true))
      .filter((product) => (type ? (product.tipo_produto ?? "produto") === type : true))
      .sort((a, b) => {
        const priceA = productPrice(a);
        const priceB = productPrice(b);
        if (order === "menor-preco") return priceA - priceB;
        if (order === "maior-preco") return priceB - priceA;
        if (order === "destaques") return Number(b.destaque) - Number(a.destaque);
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [products, search, category, type, order]);

  return (
    <section
      id="produtos"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_8%_18%,rgba(215,174,74,0.08),transparent_28%),radial-gradient(circle_at_92%_8%,rgba(234,219,200,0.55),transparent_32%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_55%,#FAF6EF_100%)] py-10 lg:py-20"
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full border border-[#C9A24D]/10 bg-white/18" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-72 w-[420px] rounded-bl-[180px] bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(234,219,200,0.24))] lg:block" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[clamp(32px,6vw,96px)]"
      >
        <motion.div variants={fadeInUp} className="grid gap-4 lg:grid-cols-[1fr_460px] lg:items-start lg:gap-8">
          <div>
            <h2 className="font-serif text-[34px] font-normal leading-none tracking-[-0.03em] text-[#1E1D1B] lg:text-[clamp(56px,5vw,84px)] lg:tracking-[-0.035em]">
              Escolha suas peças favoritas
            </h2>
            <div className="mt-4 flex max-w-[220px] items-center gap-3 lg:mt-7 lg:max-w-[420px]">
              <span className="h-px flex-1 bg-[#C9A24D]/50" />
              <span className="text-[#C9A24D]">✦</span>
              <span className="h-px flex-1 bg-[#C9A24D]/50" />
            </div>
          </div>

          <p className="max-w-[420px] text-sm leading-6 text-[#6F6258] lg:max-w-[460px] lg:pt-3 lg:text-[17px] lg:leading-[1.7]">
            Monte seu pedido, adicione à sacola e finalize pelo WhatsApp com atendimento personalizado.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:gap-3">
          <CategoryChip active={!category} onClick={() => setCategory("")}>
            Todos
          </CategoryChip>
          {visibleCategories.map((item) => (
            <CategoryChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
              {item.nome}
            </CategoryChip>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-5 grid gap-2 rounded-[18px] border border-[#C9A24D]/20 bg-white/52 p-3 shadow-[0_16px_42px_rgba(90,64,35,0.07)] backdrop-blur-xl md:grid-cols-[1fr_auto] lg:mt-7 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-3 lg:rounded-[22px] lg:p-[18px_22px] lg:shadow-[0_22px_60px_rgba(90,64,35,0.08)]"
        >
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B88A2A] lg:left-4" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou palavra-chave"
              className="h-12 w-full rounded-xl border border-[#C9A24D]/20 bg-white/72 pl-10 pr-3 text-sm text-[#4A403A] outline-none transition placeholder:text-[#9C9088] focus:border-[#C9A24D]/60 focus:shadow-[0_0_0_4px_rgba(201,162,77,0.10)] lg:h-14 lg:pl-12 lg:pr-4"
            />
          </label>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#C9A24D]/30 bg-[#FAF6EF]/74 px-4 text-sm font-semibold text-[#1E1D1B] md:hidden"
          >
            <SlidersHorizontal size={18} className="text-[#B88A2A]" />
            Filtros
          </button>

          <select value={category} onChange={(event) => setCategory(event.target.value)} className="hidden h-14 rounded-xl border border-[#C9A24D]/20 bg-white/72 px-4 text-sm text-[#4A403A] outline-none focus:border-[#C9A24D]/60 md:block">
            <option value="">Todas as categorias</option>
            {visibleCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)} className="hidden h-14 rounded-xl border border-[#C9A24D]/20 bg-white/72 px-4 text-sm text-[#4A403A] outline-none focus:border-[#C9A24D]/60 lg:block">
            <option value="">Todos os tipos</option>
            <option value="produto">Produtos</option>
            <option value="kit">Kits</option>
          </select>
          <select value={order} onChange={(event) => setOrder(event.target.value)} className="hidden h-14 rounded-xl border border-[#C9A24D]/20 bg-white/72 px-4 text-sm text-[#4A403A] outline-none focus:border-[#C9A24D]/60 lg:block">
            <option value="recentes">Mais recentes</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="destaques">Destaques primeiro</option>
          </select>
        </motion.div>

        {mobileFiltersOpen ? (
          <motion.div variants={fadeInUp} className="mt-3 grid gap-2 rounded-[18px] border border-[#C9A24D]/20 bg-white/72 p-3 shadow-[0_14px_35px_rgba(90,64,35,0.07)] md:hidden">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-xl border border-[#C9A24D]/20 bg-white/80 px-3 text-sm text-[#4A403A] outline-none">
              <option value="">Todas as categorias</option>
              {visibleCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
            <select value={type} onChange={(event) => setType(event.target.value)} className="h-12 rounded-xl border border-[#C9A24D]/20 bg-white/80 px-3 text-sm text-[#4A403A] outline-none">
              <option value="">Todos os tipos</option>
              <option value="produto">Produtos</option>
              <option value="kit">Kits</option>
            </select>
            <select value={order} onChange={(event) => setOrder(event.target.value)} className="h-12 rounded-xl border border-[#C9A24D]/20 bg-white/80 px-3 text-sm text-[#4A403A] outline-none">
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="destaques">Destaques primeiro</option>
            </select>
          </motion.div>
        ) : null}

        {filtered.length ? (
          <>
            <motion.div variants={staggerContainer} className={`mt-8 hidden gap-x-7 gap-y-6 md:grid md:grid-cols-2 ${filtered.length === 1 ? "xl:grid-cols-[minmax(0,430px)] xl:justify-center" : "xl:grid-cols-3"}`}>
              {filtered.map((product) => (
                <DesktopProductCard key={product.id} lojaSlug={lojaSlug} product={product} preview={preview} />
              ))}
            </motion.div>

            <motion.div variants={staggerContainer} className="mt-5 flex flex-col gap-3 md:hidden">
              {filtered.map((product) => (
                <MobileProductCard key={product.id} lojaSlug={lojaSlug} product={product} preview={preview} />
              ))}
            </motion.div>
          </>
        ) : (
          <div className="mt-10 rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-8 text-center shadow-[0_22px_60px_rgba(80,55,25,0.08)] backdrop-blur md:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320] shadow-[0_14px_30px_rgba(168,121,33,0.16)]">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 font-serif text-[clamp(32px,4vw,48px)] leading-none text-[#1E1D1B]">
              {hasProducts ? "Nenhuma peça encontrada" : "Novas peças em breve"}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-[#6F6258]">
              {hasProducts
                ? "Ajuste os filtros ou limpe a busca para encontrar outras peças da coleção."
                : "Estamos preparando uma seleção especial de acessórios. Fale pelo WhatsApp para acompanhar os lançamentos."}
            </p>
            {hasProducts ? (
              <Button type="button" variant="secondary" onClick={() => { setSearch(""); setCategory(""); setType(""); }} className="mt-7 rounded-full">
                Limpar filtros
              </Button>
            ) : null}
            {!hasProducts && whatsappUrl ? (
              <Link href={whatsappUrl} target="_blank" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-6 text-sm font-bold text-white shadow-[0_16px_35px_rgba(168,121,33,0.20)] transition hover:-translate-y-0.5">
                <MessageCircle size={17} />
                Falar com a loja
              </Link>
            ) : null}
          </div>
        )}

        <motion.div variants={fadeInUp} className="mt-10 grid gap-4 rounded-[18px] border border-[#C9A24D]/20 bg-white/58 p-5 shadow-[0_18px_45px_rgba(80,55,25,0.07)] backdrop-blur lg:grid-cols-4 lg:gap-0 lg:p-0">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`flex items-center gap-4 px-4 py-3 lg:px-8 lg:py-5 ${index > 0 ? "lg:border-l lg:border-[#C9A24D]/20" : ""}`}>
                <Icon size={34} className="shrink-0 text-[#B88A2A]" strokeWidth={1.4} />
                <div>
                  <p className="text-sm font-bold text-[#1E1D1B]">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6F6258]">{item.text}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition lg:h-11 lg:px-6 lg:text-sm ${
        active
          ? "bg-[linear-gradient(135deg,#D7AE4A,#A87921)] text-white shadow-[0_12px_26px_rgba(168,121,33,0.18)]"
          : "border border-[#C9A24D]/28 bg-white/55 text-[#4A403A] hover:-translate-y-0.5 hover:border-[#C9A24D]/50 hover:bg-[#F7EFE3]"
      }`}
    >
      {children}
    </button>
  );
}

function getBadge(product: Produto) {
  return productBadge(product) || (product.tipo_produto === "kit" ? "Kit especial" : "");
}

function getCategory(product: Produto) {
  return product.categorias?.nome ?? (product.tipo_produto === "kit" ? "Kits" : "Acessórios");
}

type AddItemToCart = (item: { id: string; nome: string; slug: string; preco: number; imagem_url: string | null }, quantidade?: number) => void;

function addProductToCart(product: Produto, addItem: AddItemToCart, preview?: boolean) {
  if (process.env.NODE_ENV === "production" && product.id.startsWith("mock-")) {
    toast.error("Este produto ainda não está disponível para pedido.");
    return;
  }
  if (isOutOfStock(product)) {
    toast.error("Este produto está esgotado no momento.");
    return;
  }
  const price = productPrice(product);
  addItem({ id: product.id, nome: productName(product.nome), slug: product.slug, preco: price, imagem_url: product.imagem_url });
  toast.success(preview ? "Produto de exemplo adicionado à sacola." : "Produto adicionado ao pedido.");
  window.dispatchEvent(new Event("open-cart"));
}

function DesktopProductCard({ lojaSlug, product, preview }: { lojaSlug: string; product: Produto; preview?: boolean }) {
  const badge = getBadge(product);
  const price = productPrice(product);
  const href = `/${lojaSlug}/shop/produto/${product.slug}`;
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -7, scale: 1.01 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[24px] border border-[#C9A24D]/14 bg-white/76 shadow-[0_20px_50px_rgba(80,55,25,0.08)] transition duration-300 hover:border-[#C9A24D]/34 hover:shadow-[0_32px_80px_rgba(80,55,25,0.15)]"
    >
      <Link href={href} className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#C9A24D]/20">
        <div className="relative h-[250px] overflow-hidden bg-[#EADBC8]">
          {product.imagem_url ? (
            <Image
              src={product.imagem_url}
              alt={product.nome}
              fill
              quality={96}
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover object-center transition duration-700 group-hover:scale-110"
            />
          ) : null}
          {badge ? <span className="absolute left-4 top-4 rounded-full border border-[#C9A24D]/25 bg-white/88 px-3 py-1.5 text-xs font-bold text-[#B8841F] shadow-[0_8px_20px_rgba(80,55,25,0.08)]">{badge}</span> : null}
          <span className="absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-[#1E1D1B]/70 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white opacity-0 shadow-[0_18px_38px_rgba(30,29,27,0.18)] backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver detalhes
          </span>
        </div>
      </Link>

      <div className="p-5 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A24D]">{getCategory(product)}</p>
        <Link href={href} className="block">
          <h3 className="mt-2 font-serif text-[26px] leading-[1.08] text-[#1E1D1B] transition group-hover:text-[#A87921]">{productName(product.nome)}</h3>
        </Link>
        {productDescription(product) ? <p className="mt-2 line-clamp-2 text-[14px] leading-5 text-[#6F6258]">{productDescription(product)}</p> : null}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[19px] font-extrabold text-[#A87921]">{formatPrice(price)}</span>
          {hasPromo(product) ? <span className="text-sm text-[#AFA49B] line-through">{formatPrice(product.preco)}</span> : null}
        </div>
        <p className={`mt-2 text-xs font-bold ${isOutOfStock(product) ? "text-red-700" : isLowStock(product) ? "text-[#A87921]" : "text-[#6F6258]"}`}>
          {isOutOfStock(product) ? "Produto esgotado" : isLowStock(product) ? "Últimas unidades" : "Pronta entrega"}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link href={href} className="min-w-0">
            <Button variant="secondary" className="h-11 w-full rounded-full border-[#C9A24D]/22 bg-[#FAF6EF]/80 px-3 text-xs text-[#3A2A24] hover:bg-[#F7EFE3]">
              <Eye size={15} />
              Ver detalhes
            </Button>
          </Link>
          <Button disabled={isOutOfStock(product)} onClick={() => addProductToCart(product, addItem, preview)} className="h-11 w-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-3 text-xs shadow-[0_14px_30px_rgba(168,121,33,0.18)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            <ShoppingBag size={15} />
            {isOutOfStock(product) ? "Esgotado" : "Adicionar"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function MobileProductCard({ lojaSlug, product, preview }: { lojaSlug: string; product: Produto; preview?: boolean }) {
  const badge = getBadge(product);
  const price = productPrice(product);
  const href = `/${lojaSlug}/shop/produto/${product.slug}`;
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article variants={fadeInUp} whileTap={{ scale: 0.99 }} className="relative grid min-h-[140px] grid-cols-[42%_58%] overflow-hidden rounded-[18px] border border-[#C9A24D]/14 bg-white/82 shadow-[0_12px_28px_rgba(80,55,25,0.07)]">
      <Link href={href} className="relative block bg-[#EADBC8]">
        {product.imagem_url ? <Image src={product.imagem_url} alt={product.nome} fill quality={96} sizes="42vw" className="object-cover" /> : null}
        {badge ? <span className="absolute left-2.5 top-2.5 rounded-full border border-[#C9A24D]/20 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#B8841F] shadow-sm">{badge}</span> : null}
      </Link>
      <div className="relative p-3 pr-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24D]">{getCategory(product)}</p>
        <Link href={href}>
          <h3 className="mt-1 line-clamp-2 font-serif text-[20px] leading-[1.05] text-[#1E1D1B]">{productName(product.nome)}</h3>
        </Link>
        {productDescription(product) ? <p className="mt-1 hidden text-[12px] leading-[1.35] text-[#6F6258] min-[390px]:line-clamp-1 min-[390px]:block">{productDescription(product)}</p> : null}
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-extrabold text-[#A87921]">{formatPrice(price)}</span>
          {hasPromo(product) ? <span className="text-xs text-[#AFA49B] line-through">{formatPrice(product.preco)}</span> : null}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <Link href={href}>
            <Button variant="secondary" className="h-8 w-full rounded-full px-2 text-[10px]">
              Ver
            </Button>
          </Link>
          <Button disabled={isOutOfStock(product)} onClick={() => addProductToCart(product, addItem, preview)} className="h-8 w-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-2 text-[10px] disabled:opacity-50">
            {isOutOfStock(product) ? "Esgotado" : "Adicionar"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

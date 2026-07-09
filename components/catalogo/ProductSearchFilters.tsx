"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";
import { PremiumProductCard } from "./PremiumProductCard";
import { PremiumEmptyState } from "./PremiumEmptyState";

type ProductSearchFiltersProps = {
  lojaSlug: string;
  whatsapp: string | null;
  categorias: Categoria[];
  produtos: Produto[];
  preview?: boolean;
};

export function ProductSearchFilters({ lojaSlug, whatsapp, categorias, produtos, preview }: ProductSearchFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [order, setOrder] = useState("recentes");

  const filtered = useMemo(() => {
    return [...produtos]
      .filter((produto) => produto.nome.toLowerCase().includes(search.toLowerCase()))
      .filter((produto) => (category ? produto.categoria_id === category || produto.categorias?.id === category : true))
      .filter((produto) => (type ? (produto.tipo_produto ?? "produto") === type : true))
      .sort((a, b) => {
        const priceA = a.preco_promocional ?? a.preco;
        const priceB = b.preco_promocional ?? b.preco;
        if (order === "menor-preco") return priceA - priceB;
        if (order === "maior-preco") return priceB - priceA;
        return (b.created_at || "").localeCompare(a.created_at || "");
      });
  }, [produtos, search, category, type, order]);

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-[28px] border border-rosa-bebe bg-white p-4 shadow-[0_14px_45px_rgba(31,31,31,0.05)] lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dourado" size={18} />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome" className="pl-11" />
        </label>
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
        </Select>
        <Select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="produto">Produtos</option>
          <option value="kit">Kits</option>
        </Select>
        <Select value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="recentes">Mais recentes</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
        </Select>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((produto) => <PremiumProductCard key={produto.id} lojaSlug={lojaSlug} produto={produto} preview={preview} />)}
        </div>
      ) : (
        <PremiumEmptyState whatsapp={whatsapp} title="Nenhum produto encontrado" text="Novidades lindas podem aparecer por aqui em breve." />
      )}
    </div>
  );
}

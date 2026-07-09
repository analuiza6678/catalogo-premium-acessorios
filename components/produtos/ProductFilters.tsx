"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Categoria } from "@/types/categoria";

type ProductFiltersProps = {
  categorias: Categoria[];
  search: string;
  category: string;
  status: string;
  order: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onStatus: (value: string) => void;
  onOrder: (value: string) => void;
};

export function ProductFilters({ categorias, search, category, status, order, onSearch, onCategory, onStatus, onOrder }: ProductFiltersProps) {
  return (
    <div className="grid gap-3 rounded-[24px] border border-[#E7D8C5] bg-white/80 p-4 shadow-soft md:grid-cols-2 xl:grid-cols-4">
      <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar produto, SKU ou coleção" />
      <Select value={category} onChange={(event) => onCategory(event.target.value)}>
        <option value="">Todas as categorias</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
        ))}
      </Select>
      <Select value={status} onChange={(event) => onStatus(event.target.value)}>
        <option value="">Todos os produtos</option>
        <option value="ativo">Ativos</option>
        <option value="inativo">Inativos</option>
        <option value="destaque">Em destaque</option>
        <option value="sem-destaque">Sem destaque</option>
        <option value="estoque-baixo">Estoque baixo</option>
        <option value="estoque-zerado">Estoque zerado</option>
        <option value="sem-imagem">Sem imagem</option>
        <option value="sem-categoria">Sem categoria</option>
        <option value="promocao">Com promoção</option>
      </Select>
      <Select value={order} onChange={(event) => onOrder(event.target.value)}>
        <option value="recentes">Mais recentes</option>
        <option value="antigos">Mais antigos</option>
        <option value="menor-preco">Menor preço</option>
        <option value="maior-preco">Maior preço</option>
        <option value="menor-estoque">Menor estoque</option>
        <option value="maior-estoque">Maior estoque</option>
        <option value="nome">Nome A-Z</option>
        <option value="destaques">Destaques primeiro</option>
      </Select>
    </div>
  );
}

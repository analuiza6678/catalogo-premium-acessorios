"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Categoria } from "@/types/categoria";

type ProductFiltersProps = {
  categorias: Categoria[];
  search: string;
  category: string;
  status: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onStatus: (value: string) => void;
};

export function ProductFilters({ categorias, search, category, status, onSearch, onCategory, onStatus }: ProductFiltersProps) {
  return (
    <div className="grid gap-3 rounded-[24px] bg-white p-4 shadow-soft md:grid-cols-3">
      <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar produto" />
      <Select value={category} onChange={(event) => onCategory(event.target.value)}>
        <option value="">Todas as categorias</option>
        {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
      </Select>
      <Select value={status} onChange={(event) => onStatus(event.target.value)}>
        <option value="">Todos os status</option>
        <option value="ativo">Ativos</option>
        <option value="inativo">Inativos</option>
      </Select>
    </div>
  );
}

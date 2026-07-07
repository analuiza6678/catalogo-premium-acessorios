import type { Categoria } from "./categoria";

export type Produto = {
  id: string;
  loja_id: string;
  categoria_id: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  detalhes: string | null;
  preco: number;
  preco_promocional: number | null;
  imagem_url: string | null;
  galeria_urls: string[] | null;
  ativo: boolean;
  destaque: boolean;
  estoque: number | null;
  sku: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
  tipo_produto?: "produto" | "kit" | string | null;
  badge?: string | null;
  observacao?: string | null;
  categorias?: Pick<Categoria, "id" | "nome" | "slug"> | null;
};

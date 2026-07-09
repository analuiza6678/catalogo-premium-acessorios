export type Categoria = {
  id: string;
  loja_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ativa: boolean;
  ordem: number;
  imagem_url?: string | null;
  icone?: string | null;
  created_at: string;
};

export type Categoria = {
  id: string;
  loja_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ativa: boolean;
  ordem: number;
  created_at: string;
};

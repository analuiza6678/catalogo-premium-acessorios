export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      lojas: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          whatsapp: string | null;
          instagram: string | null;
          logo_url: string | null;
          capa_url: string | null;
          capa_mobile_url: string | null;
          sobre_imagem_url: string | null;
          cor_principal: string;
          cor_secundaria: string;
          ativa: boolean;
          created_at: string;
          sobre_loja: string | null;
          estilo_loja: string | null;
          diferencial_1: string | null;
          diferencial_2: string | null;
          diferencial_3: string | null;
          dona_nome: string | null;
          dona_foto_url: string | null;
          dona_historia: string | null;
          dona_instagram: string | null;
          endereco: string | null;
          cidade: string | null;
          estado: string | null;
          horario_atendimento: string | null;
          link_maps: string | null;
          tipo_atendimento: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["lojas"]["Row"]> & { nome: string; slug: string; user_id: string };
        Update: Partial<Database["public"]["Tables"]["lojas"]["Row"]>;
      };
      categorias: {
        Row: {
          id: string;
          loja_id: string;
          nome: string;
          slug: string;
          descricao: string | null;
          ativa: boolean;
          ordem: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categorias"]["Row"]> & { loja_id: string; nome: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["categorias"]["Row"]>;
      };
      produtos: {
        Row: {
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
          tipo_produto: string | null;
          badge: string | null;
          observacao: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["produtos"]["Row"]> & { loja_id: string; nome: string; slug: string; preco: number };
        Update: Partial<Database["public"]["Tables"]["produtos"]["Row"]>;
      };
    };
  };
};

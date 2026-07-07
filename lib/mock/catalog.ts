import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export const fallbackImages = [
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e1d?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=90&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=90&w=1400&auto=format&fit=crop"
];

export const mockStore: Partial<Loja> = {
  sobre_loja: "Uma boutique de acessórios criada para transformar pequenos detalhes em presença. Cada peça é escolhida pelo brilho, acabamento e facilidade de combinar.",
  estilo_loja: "Delicado, feminino e contemporâneo, com dourados suaves, pérolas e composições pensadas para presentear ou iluminar o dia a dia.",
  diferencial_1: "Curadoria autoral",
  diferencial_2: "Kits para presente",
  diferencial_3: "Atendimento próximo",
  dona_nome: "Camila Souza",
  dona_historia: "Apaixonada por detalhes, escolhe acessórios que unem delicadeza, brilho e significado em cada composição.",
  cidade: "Atendimento online",
  estado: "",
  horario_atendimento: "Segunda a sexta, 9h às 18h",
  tipo_atendimento: "Pedidos finalizados pelo WhatsApp"
};

export const mockCategories: Categoria[] = [
  { id: "mock-brincos", loja_id: "mock", nome: "Brincos", slug: "brincos", descricao: null, ativa: true, ordem: 1, created_at: "" },
  { id: "mock-colares", loja_id: "mock", nome: "Colares", slug: "colares", descricao: null, ativa: true, ordem: 2, created_at: "" },
  { id: "mock-pulseiras", loja_id: "mock", nome: "Pulseiras", slug: "pulseiras", descricao: null, ativa: true, ordem: 3, created_at: "" },
  { id: "mock-aneis", loja_id: "mock", nome: "Anéis", slug: "aneis", descricao: null, ativa: true, ordem: 4, created_at: "" },
  { id: "mock-kits", loja_id: "mock", nome: "Kits", slug: "kits", descricao: null, ativa: true, ordem: 5, created_at: "" }
];

function product(input: Partial<Produto> & Pick<Produto, "id" | "nome" | "slug" | "preco" | "imagem_url">): Produto {
  const category = mockCategories.find((item) => item.id === input.categoria_id) ?? mockCategories[0];
  return {
    loja_id: "mock",
    categoria_id: category.id,
    descricao: "Peça delicada com acabamento elegante para usar ou presentear.",
    detalhes: null,
    preco_promocional: null,
    galeria_urls: null,
    ativo: true,
    destaque: false,
    estoque: null,
    sku: null,
    ordem: 0,
    created_at: "",
    updated_at: "",
    tipo_produto: "produto",
    badge: null,
    observacao: null,
    categorias: { id: category.id, nome: category.nome, slug: category.slug },
    ...input
  };
}

export const mockProducts: Produto[] = [
  product({ id: "mock-aurora", nome: "Brinco Pérola Aurora", slug: "brinco-perola-aurora", preco: 69.9, imagem_url: fallbackImages[0], categoria_id: "mock-brincos", destaque: true, badge: "Novo", ordem: 1 }),
  product({ id: "mock-serena", nome: "Colar Dourado Serena", slug: "colar-dourado-serena", preco: 119.9, preco_promocional: 99.9, imagem_url: fallbackImages[1], categoria_id: "mock-colares", destaque: true, badge: "Destaque", ordem: 2 }),
  product({ id: "mock-rose", nome: "Pulseira Rose Delicada", slug: "pulseira-rose-delicada", preco: 79.9, imagem_url: fallbackImages[2], categoria_id: "mock-pulseiras", badge: "Novo", ordem: 3 }),
  product({ id: "mock-elo", nome: "Pulseira Elo Clássico", slug: "pulseira-elo-classico", preco: 89.9, imagem_url: fallbackImages[3], categoria_id: "mock-pulseiras", descricao: "Design atemporal com elos trabalhados e acabamento premium.", ordem: 4 }),
  product({ id: "mock-organico", nome: "Anel Dourado Orgânico", slug: "anel-dourado-organico", preco: 59.9, imagem_url: fallbackImages[4], categoria_id: "mock-aneis", descricao: "Peça moderna com textura artesanal que traduz personalidade.", ordem: 5 }),
  product({ id: "mock-argola", nome: "Argola Dourada Média", slug: "argola-dourada-media", preco: 69.9, imagem_url: fallbackImages[5], categoria_id: "mock-brincos", descricao: "Clássica e leve, perfeita para qualquer ocasião.", ordem: 6 }),
  product({ id: "mock-coracao", nome: "Colar Duplo Coração", slug: "colar-duplo-coracao", preco: 89.9, imagem_url: fallbackImages[6], categoria_id: "mock-colares", descricao: "Camadas delicadas que trazem charme e sofisticação ao look.", ordem: 7 }),
  product({ id: "mock-flor", nome: "Brinco Ponto Luz Flor", slug: "brinco-ponto-luz-flor", preco: 49.9, imagem_url: fallbackImages[7], categoria_id: "mock-brincos", descricao: "Brilho sutil que valoriza sua beleza natural.", ordem: 8 }),
  product({ id: "mock-kit-dourado", nome: "Kit Essencial Dourado", slug: "kit-essencial-dourado", preco: 189.9, preco_promocional: 149.9, imagem_url: fallbackImages[8], categoria_id: "mock-kits", descricao: "Conjunto completo com peças versáteis para o dia a dia.", destaque: true, tipo_produto: "kit", badge: "Kit especial", ordem: 9 })
];

export const mockKits = mockProducts.filter((productItem) => productItem.tipo_produto === "kit");

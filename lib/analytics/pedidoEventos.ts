import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cart";
import type { Produto } from "@/types/produto";

type PedidoEventoInput = {
  lojaId: string;
  origem: "carrinho" | "produto";
  itens: Array<{ id: string; nome: string; slug: string; preco: number; quantidade: number; imagem_url: string | null }>;
};

export async function recordPedidoEvento({ lojaId, origem, itens }: PedidoEventoInput) {
  const total = itens.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const { error } = await createClient().from("pedido_eventos").insert({
    loja_id: lojaId,
    origem,
    itens,
    total
  });

  if (error) {
    console.warn("Pedido pelo WhatsApp nao registrado no painel:", error.message);
  }
}

export function cartItemsToPedidoItems(items: CartItem[]) {
  return items.map((item) => ({
    id: item.id,
    nome: item.nome,
    slug: item.slug,
    preco: item.preco,
    quantidade: item.quantidade,
    imagem_url: item.imagem_url
  }));
}

export function productToPedidoItem(produto: Produto, quantidade = 1) {
  return {
    id: produto.id,
    nome: produto.nome,
    slug: produto.slug,
    preco: produto.preco_promocional ?? produto.preco,
    quantidade,
    imagem_url: produto.imagem_url
  };
}

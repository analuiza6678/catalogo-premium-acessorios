"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Produto } from "@/types/produto";
import { productToPedidoItem, recordPedidoEvento } from "@/lib/analytics/pedidoEventos";
import { buildSingleProductMessage, buildWhatsappUrl } from "@/lib/utils/whatsapp";

type WhatsAppCheckoutButtonProps = {
  whatsapp: string | null;
  produto: Produto;
  lojaId?: string;
};

export function WhatsAppCheckoutButton({ whatsapp, produto, lojaId }: WhatsAppCheckoutButtonProps) {
  async function buy() {
    if (process.env.NODE_ENV === "production" && produto.id.startsWith("mock-")) {
      alert("Este produto ainda nao esta disponivel para pedido.");
      return;
    }
    const url = buildWhatsappUrl(whatsapp, buildSingleProductMessage(produto, window.location.href));
    if (!url) {
      alert("WhatsApp da loja nao configurado.");
      return;
    }
    if (lojaId) {
      await recordPedidoEvento({ lojaId, origem: "produto", itens: [productToPedidoItem(produto)] });
    }
    window.open(url, "_blank");
  }

  return (
    <Button type="button" variant="ghost" onClick={buy} className="w-full">
      <MessageCircle size={18} />
      Comprar pelo WhatsApp
    </Button>
  );
}

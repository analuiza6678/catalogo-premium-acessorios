"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/useCartStore";
import { cartItemsToPedidoItems, recordPedidoEvento } from "@/lib/analytics/pedidoEventos";
import { formatPrice } from "@/lib/utils/formatPrice";
import { buildCartMessage, buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { EmptyState } from "./EmptyState";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  whatsapp: string | null;
  lojaId?: string;
};

export function CartDrawer({ open, onClose, whatsapp, lojaId }: CartDrawerProps) {
  const { items, increaseQuantity, decreaseQuantity, removeItem, clearCart, getSubtotal } = useCartStore();

  async function finishOrder() {
    if (!items.length) {
      alert("Adicione produtos ao carrinho antes de finalizar.");
      return;
    }
    const url = buildWhatsappUrl(whatsapp, buildCartMessage(items));
    if (!url) {
      alert("WhatsApp da loja nao configurado.");
      return;
    }
    if (lojaId) {
      await recordPedidoEvento({ lojaId, origem: "carrinho", itens: cartItemsToPedidoItems(items) });
    }
    window.open(url, "_blank");
  }

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-preto/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden bg-[#FFFDF9] shadow-[0_30px_100px_rgba(30,26,24,0.22)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white bg-[linear-gradient(135deg,#FFFDF9,#F8DDEB)] p-5">
          <h2 className="font-serif text-3xl text-[#1E1A18]">Seu carrinho</h2>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="Fechar carrinho">
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {!items.length ? (
            <EmptyState title="Seu carrinho esta vazio." action="Ver produtos" onAction={onClose} />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-[24px] border border-white/80 bg-white/72 p-3 shadow-[0_14px_45px_rgba(58,42,36,0.07)]">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
                    {item.imagem_url ? <Image src={item.imagem_url} alt={item.nome} fill className="object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-semibold text-[#1E1A18]">{item.nome}</h3>
                    <p className="mt-1 text-sm font-bold text-[#C9A227]">{formatPrice(item.preco)}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full bg-white p-1">
                        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-rosa-bebe" onClick={() => decreaseQuantity(item.id)}>
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantidade}</span>
                        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-rosa-bebe" onClick={() => increaseQuantity(item.id)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="text-texto hover:text-red-600" onClick={() => removeItem(item.id)} aria-label="Remover produto">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-rosa-bebe p-5">
          <div className="mb-4 flex items-center justify-between rounded-[24px] bg-white/75 px-4 py-3 text-sm">
            <span>Subtotal</span>
            <strong className="text-xl text-[#C9A227]">{formatPrice(getSubtotal())}</strong>
          </div>
          <Button className="w-full" onClick={finishOrder}>
            Finalizar no WhatsApp
          </Button>
          <Button variant="secondary" className="mt-2 w-full" onClick={onClose}>
            Continuar comprando
          </Button>
          {items.length ? (
            <Button variant="ghost" className="mt-2 w-full" onClick={clearCart}>
              Limpar carrinho
            </Button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

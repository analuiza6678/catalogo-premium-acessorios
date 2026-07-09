import type { CartItem } from "@/types/cart";
import type { Produto } from "@/types/produto";
import { formatPrice } from "./formatPrice";

export function normalizeWhatsapp(value?: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

export function isPlaceholderWhatsapp(phone?: string | null) {
  const normalized = normalizeWhatsapp(phone);
  return ["5599999999999", "5500000000000", "5511999999999"].includes(normalized);
}

export function buildCartMessage(items: CartItem[]) {
  const lines = ["Ola! Tenho interesse nos seguintes produtos:", ""];

  items.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    lines.push(
      `${index + 1}. Produto: ${item.nome}`,
      `   Quantidade: ${item.quantidade}`,
      `   Valor unitário: ${formatPrice(item.preco)}`,
      `   Subtotal: ${formatPrice(subtotal)}`,
      ""
    );
  });

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  lines.push(`Total do pedido: ${formatPrice(total)}`, "", "Aguardo confirmação.");
  return lines.join("\n");
}

export function buildSingleProductMessage(produto: Produto, url: string, quantidade = 1) {
  if (produto.whatsapp_mensagem) {
    const price = produto.preco_promocional ?? produto.preco;
    return produto.whatsapp_mensagem
      .replaceAll("{{nome}}", produto.nome)
      .replaceAll("{{preço}}", formatPrice(price))
      .replaceAll("{{preco}}", formatPrice(price))
      .replaceAll("{{link}}", url);
  }
  const price = produto.preco_promocional ?? produto.preco;
  return [
    "Ola! Tenho interesse neste produto:",
    "",
    `Produto: ${produto.nome}`,
    `Quantidade: ${quantidade}`,
    `Valor: ${formatPrice(price)}`,
    `Link: ${url}`,
    "",
    "Aguardo confirmação."
  ].join("\n");
}

export function buildWhatsappUrl(phone: string | null | undefined, message: string) {
  const normalized = normalizeWhatsapp(phone);
  if (!normalized) return null;
  if (process.env.NODE_ENV === "production" && isPlaceholderWhatsapp(normalized)) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

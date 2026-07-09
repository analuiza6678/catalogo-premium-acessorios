import type { Produto } from "@/types/produto";

const emptyLike = new Set(["", ".", "-", "--", "null", "undefined"]);

export function cleanText(value?: string | null) {
  const text = String(value ?? "").trim();
  return emptyLike.has(text.toLowerCase()) ? "" : text;
}

export function productName(nome: string) {
  return nome
    .replace(/\bE\b/g, "e")
    .replace(/\bHipie\b/gi, "Hippie")
    .replace(/\s+/g, " ")
    .trim();
}

export function productDescription(produto: Produto) {
  return cleanText(produto.descricao);
}

export function productDetails(produto: Produto) {
  return cleanText(produto.detalhes);
}

export function productShortDescription(produto: Produto) {
  return productDescription(produto) || "Peça delicada selecionada para compor produções femininas com elegância.";
}

export function productPrice(produto: Produto) {
  return produto.preco_promocional ?? produto.preco;
}

export function hasPromo(produto: Produto) {
  return produto.preco_promocional != null && produto.preco_promocional > 0 && produto.preco_promocional < produto.preco;
}

export function isOutOfStock(produto: Produto) {
  return produto.estoque === 0;
}

export function isLowStock(produto: Produto) {
  const minStock = produto.estoque_minimo ?? 2;
  return produto.estoque != null && produto.estoque > 0 && produto.estoque <= minStock;
}

export function productBadge(produto: Produto) {
  if (isOutOfStock(produto)) return "Esgotado";
  if (isLowStock(produto)) return "Últimas unidades";
  if (hasPromo(produto)) return "Promoção";
  return cleanText(produto.badge) || (produto.destaque ? "Destaque" : "");
}

export function technicalDetails(produto: Produto) {
  return [
    { label: "Material", value: cleanText(produto.material) },
    { label: "Banho / cor", value: cleanText(produto.banho_cor) },
    { label: "Tamanho", value: cleanText(produto.tamanho) },
    { label: "Medidas", value: cleanText(produto.medidas) },
    { label: "Peso", value: cleanText(produto.peso) },
    { label: "Fechamento", value: cleanText(produto.fechamento) },
    { label: "Indicação", value: cleanText(produto.ocasiao) }
  ].filter((item) => item.value);
}

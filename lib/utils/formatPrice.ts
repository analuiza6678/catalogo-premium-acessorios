export function formatPrice(value: number | null | undefined) {
  const safeValue = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(safeValue);
}

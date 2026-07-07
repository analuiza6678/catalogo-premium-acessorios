import type { Produto } from "@/types/produto";
import { EmptyState } from "./EmptyState";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  lojaSlug: string;
  produtos: Produto[];
  emptyTitle?: string;
};

export function ProductGrid({ lojaSlug, produtos, emptyTitle = "Nenhum produto encontrado" }: ProductGridProps) {
  if (!produtos.length) {
    return <EmptyState title={emptyTitle} description="Novidades lindas podem aparecer por aqui em breve." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} lojaSlug={lojaSlug} produto={produto} />
      ))}
    </div>
  );
}

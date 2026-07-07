import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";
import { mockCategories, mockProducts, mockStore } from "@/lib/mock/catalog";
import { CartButton } from "./CartButton";
import { DecorativeBackground } from "./DecorativeBackground";
import { EditorialHero } from "./EditorialHero";
import { BenefitsShowcase } from "./BenefitsShowcase";
import { PremiumKitsSection } from "./PremiumKitsSection";
import { ProductCatalogSection } from "./ProductCatalogSection";
import { StoreStorySection } from "./StoreStorySection";
import { OwnerStorySection } from "./OwnerStorySection";
import { LocationExperienceSection } from "./LocationExperienceSection";
import { FinalWhatsAppCTA } from "./FinalWhatsAppCTA";
import { PremiumFooter } from "./PremiumFooter";
import { PremiumHeader } from "./PremiumHeader";

export function PremiumShopPage({ loja, categorias, produtos }: { loja: Loja; categorias: Categoria[]; produtos: Produto[] }) {
  const hasProducts = produtos.length > 0;
  const displayProducts = hasProducts ? produtos : mockProducts;
  const displayCategories = categorias.length ? categorias : mockCategories;
  const enrichedLoja = { ...mockStore, ...loja } as Loja;
  const kits = displayProducts.filter((product) => product.tipo_produto === "kit");

  return (
    <main className="premium-shop min-h-screen text-[#1E1A18]">
      <DecorativeBackground />
      <PremiumHeader loja={enrichedLoja} />
      <EditorialHero loja={enrichedLoja} products={displayProducts} />
      <ProductCatalogSection lojaSlug={loja.slug} categories={displayCategories} products={displayProducts} preview={!hasProducts} />
      <BenefitsShowcase />
      <PremiumKitsSection lojaSlug={loja.slug} kits={kits} preview={!hasProducts} whatsapp={enrichedLoja.whatsapp} />
      <StoreStorySection loja={enrichedLoja} />
      <OwnerStorySection loja={enrichedLoja} />
      <LocationExperienceSection loja={enrichedLoja} />
      <FinalWhatsAppCTA loja={enrichedLoja} />
      <PremiumFooter loja={enrichedLoja} />
      <CartButton whatsapp={loja.whatsapp} lojaId={loja.id} />
    </main>
  );
}

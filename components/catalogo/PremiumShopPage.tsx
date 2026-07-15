import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";
import type { StoreSection } from "@/types/store-section";
import type { StoreTheme } from "@/types/store-theme";
import { mockCategories, mockProducts, mockStore } from "@/lib/mock/catalog";
import { getSection, resolveStoreSections } from "@/types/store-section";
import { resolveStoreTheme, storeThemeToCssVars } from "@/types/store-theme";
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

export function PremiumShopPage({
  loja,
  categorias,
  produtos,
  theme,
  sections
}: {
  loja: Loja;
  categorias: Categoria[];
  produtos: Produto[];
  theme?: StoreTheme | null;
  sections?: StoreSection[];
}) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasProducts = produtos.length > 0;
  const displayProducts = hasProducts ? produtos : isDevelopment ? mockProducts : [];
  const displayCategories = categorias.length ? categorias : isDevelopment ? mockCategories : [];
  const enrichedLoja = (isDevelopment ? { ...mockStore, ...loja } : loja) as Loja;
  const resolvedTheme = resolveStoreTheme(enrichedLoja, theme);
  const resolvedSections = resolveStoreSections(enrichedLoja.id, sections);
  const section = (type: StoreSection["type"]) => getSection(resolvedSections, type);
  const isEnabled = (type: StoreSection["type"]) => section(type)?.enabled !== false;
  const kits = displayProducts.filter((product) => product.tipo_produto === "kit");
  const preview = !hasProducts && isDevelopment;
  const showKits = kits.length > 0 || preview;

  return (
    <main className="premium-shop min-h-screen bg-[var(--store-background)] text-[var(--store-text)]" style={storeThemeToCssVars(resolvedTheme)}>
      <DecorativeBackground />
      <PremiumHeader loja={enrichedLoja} showKits={showKits} />
      {isEnabled("hero") ? <EditorialHero loja={enrichedLoja} products={displayProducts} content={section("hero")?.content} /> : null}
      {isEnabled("products") ? (
        <ProductCatalogSection
          lojaSlug={loja.slug}
          categories={displayCategories}
          products={displayProducts}
          preview={preview}
          whatsapp={enrichedLoja.whatsapp}
          content={section("products")?.content}
        />
      ) : null}
      {isEnabled("benefits") || isEnabled("how_to_buy") ? (
        <BenefitsShowcase benefitsContent={section("benefits")?.content} howToBuyContent={section("how_to_buy")?.content} showBenefits={isEnabled("benefits")} showHowToBuy={isEnabled("how_to_buy")} />
      ) : null}
      {showKits ? <PremiumKitsSection lojaSlug={loja.slug} kits={kits} preview={preview} whatsapp={enrichedLoja.whatsapp} /> : null}
      {isEnabled("about") ? <StoreStorySection loja={enrichedLoja} /> : null}
      {isEnabled("owner") ? <OwnerStorySection loja={enrichedLoja} /> : null}
      {isEnabled("location") ? <LocationExperienceSection loja={enrichedLoja} /> : null}
      {isEnabled("final_cta") ? <FinalWhatsAppCTA loja={enrichedLoja} content={section("final_cta")?.content} /> : null}
      {isEnabled("footer") ? <PremiumFooter loja={enrichedLoja} content={section("footer")?.content} /> : null}
      <CartButton whatsapp={loja.whatsapp} lojaId={loja.id} />
    </main>
  );
}

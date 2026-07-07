import Link from "next/link";
import { notFound } from "next/navigation";
import { CartButton } from "@/components/catalogo/CartButton";
import { ProductDetails } from "@/components/catalogo/ProductDetails";
import { ProductGrid } from "@/components/catalogo/ProductGrid";
import { Button } from "@/components/ui/Button";
import { SetupRequired } from "@/components/ui/SetupRequired";
import { SupabaseError } from "@/components/ui/SupabaseError";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import { mockProducts } from "@/lib/mock/catalog";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string; produtoSlug: string } }) {
  if (!hasSupabaseEnv()) return <SetupRequired />;

  const supabase = createPublicClient();
  const { data: loja, error: lojaError } = await supabase.from("lojas").select("*").eq("slug", params.slug).eq("ativa", true).single();
  if (lojaError && lojaError.code !== "PGRST116") return <SupabaseError message={lojaError.message} />;
  if (!loja) notFound();

  const { data: produto } = await supabase
    .from("produtos")
    .select("*, categorias(id,nome,slug)")
    .eq("loja_id", loja.id)
    .eq("slug", params.produtoSlug)
    .eq("ativo", true)
    .single();

  const mockProduto = mockProducts.find((item) => item.slug === params.produtoSlug) ?? null;
  const produtoAtual = (produto ?? mockProduto) as Produto | null;

  if (!produtoAtual) notFound();

  const { data: relacionados } = produto
    ? await supabase
    .from("produtos")
    .select("*, categorias(id,nome,slug)")
    .eq("loja_id", loja.id)
    .eq("ativo", true)
    .eq("categoria_id", produto.categoria_id)
    .neq("id", produto.id)
    .limit(3)
    : { data: mockProducts.filter((item) => item.categoria_id === produtoAtual.categoria_id && item.id !== produtoAtual.id).slice(0, 3) };

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-rosa-bebe bg-white/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/${params.slug}/shop`} className="font-serif text-2xl text-preto">
            {loja.nome}
          </Link>
          <Link href={`/${params.slug}/shop`}>
            <Button variant="ghost">Continuar comprando</Button>
          </Link>
        </div>
      </div>
      <ProductDetails loja={loja as Loja} produto={produtoAtual} />
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-5 font-serif text-4xl text-preto">Produtos relacionados</h2>
        <ProductGrid lojaSlug={params.slug} produtos={(relacionados ?? []) as Produto[]} emptyTitle="Nenhum produto relacionado encontrado." />
      </section>
      <CartButton whatsapp={loja.whatsapp} lojaId={loja.id} />
    </main>
  );
}

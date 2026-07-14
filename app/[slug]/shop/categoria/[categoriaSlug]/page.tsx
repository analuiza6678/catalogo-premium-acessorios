import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CartButton } from "@/components/catalogo/CartButton";
import { CategoryTabs } from "@/components/catalogo/CategoryTabs";
import { ProductGrid } from "@/components/catalogo/ProductGrid";
import { ShopHeader } from "@/components/catalogo/ShopHeader";
import { SetupRequired } from "@/components/ui/SetupRequired";
import { SupabaseError } from "@/components/ui/SupabaseError";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string; categoriaSlug: string } }): Promise<Metadata> {
  if (!hasSupabaseEnv()) return { title: "Categoria" };

  const supabase = createPublicClient();
  const { data: loja } = await supabase.from("lojas").select("id,nome,descricao,capa_url,logo_url").eq("slug", params.slug).eq("ativa", true).single();
  if (!loja) return { title: "Categoria não encontrada" };

  const { data: categoria } = await supabase
    .from("categorias")
    .select("nome,descricao")
    .eq("loja_id", loja.id)
    .eq("slug", params.categoriaSlug)
    .eq("ativa", true)
    .single();

  if (!categoria) return { title: `${loja.nome} | Categoria` };

  const title = `${categoria.nome} | ${loja.nome}`;
  const description = categoria.descricao || loja.descricao || "Produtos selecionados para pedido pelo WhatsApp.";
  const image = loja.capa_url || loja.logo_url || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export default async function CategoryPage({ params }: { params: { slug: string; categoriaSlug: string } }) {
  if (!hasSupabaseEnv()) return <SetupRequired />;

  const supabase = createPublicClient();
  const { data: loja, error: lojaError } = await supabase.from("lojas").select("*").eq("slug", params.slug).eq("ativa", true).single();
  if (lojaError && lojaError.code !== "PGRST116") return <SupabaseError message={lojaError.message} />;
  if (!loja) notFound();

  const [{ data: categorias }, { data: categoria }] = await Promise.all([
    supabase.from("categorias").select("*").eq("loja_id", loja.id).eq("ativa", true).order("ordem"),
    supabase.from("categorias").select("*").eq("loja_id", loja.id).eq("slug", params.categoriaSlug).eq("ativa", true).single()
  ]);

  if (!categoria) notFound();

  const { data: produtos } = await supabase
    .from("produtos")
    .select("*, categorias(id,nome,slug)")
    .eq("loja_id", loja.id)
    .eq("categoria_id", categoria.id)
    .eq("ativo", true)
    .order("ordem")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white">
      <ShopHeader loja={loja as Loja} />
      <CategoryTabs lojaSlug={params.slug} categorias={(categorias ?? []) as Categoria[]} activeSlug={params.categoriaSlug} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-4xl text-preto sm:text-5xl">{categoria.nome}</h1>
        {categoria.descricao ? <p className="mt-3 max-w-2xl leading-7 text-texto">{categoria.descricao}</p> : null}
        <div className="mt-7">
          <ProductGrid lojaSlug={params.slug} produtos={(produtos ?? []) as Produto[]} emptyTitle="Nenhum produto encontrado nesta categoria." />
        </div>
      </section>
      <CartButton whatsapp={loja.whatsapp} lojaId={loja.id} />
    </main>
  );
}

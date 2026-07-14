import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PremiumShopPage } from "@/components/catalogo/PremiumShopPage";
import { SetupRequired } from "@/components/ui/SetupRequired";
import { SupabaseError } from "@/components/ui/SupabaseError";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!hasSupabaseEnv()) return { title: "Catálogo" };

  const supabase = createPublicClient();
  const { data: loja } = await supabase
    .from("lojas")
    .select("nome, descricao, capa_url, logo_url")
    .eq("slug", params.slug)
    .eq("ativa", true)
    .single();

  if (!loja) return { title: "Catálogo não encontrado" };

  const title = `${loja.nome} | Acessórios femininos delicados`;
  const description = loja.descricao || "Catálogo de acessórios femininos delicados e sofisticados. Escolha suas peças favoritas e finalize pelo WhatsApp.";
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

export default async function ShopPage({ params }: { params: { slug: string } }) {
  if (!hasSupabaseEnv()) return <SetupRequired />;

  const supabase = createPublicClient();
  const { data: loja, error: lojaError } = await supabase.from("lojas").select("*").eq("slug", params.slug).eq("ativa", true).single();

  if (lojaError && lojaError.code !== "PGRST116") return <SupabaseError message={lojaError.message} />;
  if (!loja) notFound();

  const [{ data: categorias }, { data: produtos }] = await Promise.all([
    supabase.from("categorias").select("*").eq("loja_id", loja.id).eq("ativa", true).order("ordem"),
    supabase
      .from("produtos")
      .select("*, categorias(id,nome,slug)")
      .eq("loja_id", loja.id)
      .eq("ativo", true)
      .order("destaque", { ascending: false })
      .order("ordem")
      .order("created_at", { ascending: false })
  ]);

  return <PremiumShopPage loja={loja as Loja} categorias={(categorias ?? []) as Categoria[]} produtos={(produtos ?? []) as Produto[]} />;
}

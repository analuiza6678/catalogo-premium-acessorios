import { notFound } from "next/navigation";
import { PremiumShopPage } from "@/components/catalogo/PremiumShopPage";
import { SetupRequired } from "@/components/ui/SetupRequired";
import { SupabaseError } from "@/components/ui/SupabaseError";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export const revalidate = 60;

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

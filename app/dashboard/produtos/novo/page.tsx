import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProductForm } from "@/components/produtos/ProductForm";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/types/categoria";

export default async function NovoProdutoPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
  if (!loja) redirect("/dashboard");
  const { data: categorias } = await supabase.from("categorias").select("*").eq("loja_id", loja.id).order("ordem");

  return (
    <>
      <DashboardHeader title="Novo produto" description="Preencha os dados do produto e envie uma imagem principal." />
      <ProductForm lojaId={loja.id} categorias={(categorias ?? []) as Categoria[]} />
    </>
  );
}

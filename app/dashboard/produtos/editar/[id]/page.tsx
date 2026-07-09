import { notFound, redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProductForm } from "@/components/produtos/ProductForm";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
  if (!loja) redirect("/dashboard");

  const [{ data: categorias }, { data: produto }] = await Promise.all([
    supabase.from("categorias").select("*").eq("loja_id", loja.id).order("ordem"),
    supabase.from("produtos").select("*").eq("id", params.id).eq("loja_id", loja.id).single()
  ]);

  if (!produto) notFound();

  return (
    <>
      <DashboardHeader title="Editar produto" description="Atualize informações, fotos e status do produto." />
      <ProductForm lojaId={loja.id} lojaSlug={loja.slug} categorias={(categorias ?? []) as Categoria[]} produto={produto as Produto} />
    </>
  );
}

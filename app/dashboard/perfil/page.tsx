import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StoreProfileForm } from "@/components/perfil/StoreProfileForm";
import { createClient } from "@/lib/supabase/server";
import type { Loja } from "@/types/loja";

export default async function PerfilPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
  if (!loja) redirect("/dashboard");
  const [{ count: activeCategories }, { count: activeProducts }] = await Promise.all([
    supabase.from("categorias").select("id", { count: "exact", head: true }).eq("loja_id", loja.id).eq("ativa", true),
    supabase.from("produtos").select("id", { count: "exact", head: true }).eq("loja_id", loja.id).eq("ativo", true)
  ]);

  return (
    <>
      <DashboardHeader title="Perfil da loja" description="Atualize a identidade, contato, imagens e status do catalogo." />
      <StoreProfileForm loja={loja as Loja} activeCategories={activeCategories ?? 0} activeProducts={activeProducts ?? 0} />
    </>
  );
}

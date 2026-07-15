import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StoreSectionsForm } from "@/components/admin/StoreSectionsForm";
import { createClient } from "@/lib/supabase/server";
import type { Loja } from "@/types/loja";
import type { StoreSection } from "@/types/store-section";

export default async function VitrinePage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
  if (!loja) redirect("/dashboard");

  const { data: sections } = await supabase.from("store_sections").select("*").eq("loja_id", loja.id).order("position");

  return (
    <>
      <DashboardHeader title="Editar vitrine" description="Edite textos, organize seções, salve rascunhos e publique mudanças no catálogo." />
      <StoreSectionsForm loja={loja as Loja} sections={(sections ?? []) as StoreSection[]} />
    </>
  );
}


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

  return (
    <>
      <DashboardHeader title="Perfil da loja" description="Atualize a identidade, contato, imagens e status do catalogo." />
      <StoreProfileForm loja={loja as Loja} />
    </>
  );
}

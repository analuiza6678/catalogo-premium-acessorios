import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ThemeAppearanceForm } from "@/components/admin/ThemeAppearanceForm";
import { createClient } from "@/lib/supabase/server";
import type { Loja } from "@/types/loja";
import type { StoreTheme } from "@/types/store-theme";

export default async function AparenciaPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
  if (!loja) redirect("/dashboard");

  const { data: theme } = await supabase.from("store_theme").select("*").eq("loja_id", loja.id).maybeSingle();

  return (
    <>
      <DashboardHeader title="Aparência" description="Controle cores, tipografia, botões e prévia visual do catálogo." />
      <ThemeAppearanceForm loja={loja as Loja} theme={(theme ?? null) as StoreTheme | null} />
    </>
  );
}


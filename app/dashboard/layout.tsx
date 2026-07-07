import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SetupRequired } from "@/components/ui/SetupRequired";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseEnv()) return <SetupRequired />;

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return <DashboardLayout>{children}</DashboardLayout>;
}

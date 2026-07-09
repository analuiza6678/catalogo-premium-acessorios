"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CategoryAdminCard } from "@/components/categorias/CategoryAdminCard";
import { CategoryForm } from "@/components/categorias/CategoryForm";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";

export default function CategoriasPage() {
  const [loja, setLoja] = useState<Loja | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  async function load() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data: lojaData } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
    setLoja(lojaData as Loja);
    if (lojaData) {
      const { data } = await supabase.from("categorias").select("*").eq("loja_id", lojaData.id).order("ordem");
      setCategorias((data ?? []) as Categoria[]);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <DashboardHeader title="Categorias" description="Organize seus produtos para facilitar a navegação no catálogo." />
      {loja ? (
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <Card className="p-5">
            <h2 className="mb-4 font-serif text-3xl text-preto">Nova categoria</h2>
            <CategoryForm lojaId={loja.id} onSaved={load} />
          </Card>
          <div className="space-y-4">
            {categorias.length ? (
              categorias.map((categoria) => (
                <CategoryAdminCard key={categoria.id} categoria={categoria} lojaId={loja.id} onChanged={load} />
              ))
            ) : (
              <Card className="p-8 text-center">
                <h2 className="font-serif text-3xl text-preto">Nenhuma categoria cadastrada ainda</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-texto">
                  Crie categorias para organizar melhor sua vitrine e facilitar a navegação das clientes.
                </p>
              </Card>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

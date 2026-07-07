"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProductAdminCard } from "@/components/produtos/ProductAdminCard";
import { ProductFilters } from "@/components/produtos/ProductFilters";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/categoria";
import type { Loja } from "@/types/loja";
import type { Produto } from "@/types/produto";

export default function ProdutosPage() {
  const [loja, setLoja] = useState<Loja | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data: lojaData } = await supabase.from("lojas").select("*").eq("user_id", userData.user.id).single();
    setLoja(lojaData as Loja);
    if (!lojaData) return;
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categorias").select("*").eq("loja_id", lojaData.id).order("ordem"),
      supabase.from("produtos").select("*, categorias(id,nome,slug)").eq("loja_id", lojaData.id).order("created_at", { ascending: false })
    ]);
    setCategorias((cats ?? []) as Categoria[]);
    setProdutos((prods ?? []) as Produto[]);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return produtos.filter((produto) => {
      const matchSearch = produto.nome.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category ? produto.categoria_id === category : true;
      const matchStatus = status === "ativo" ? produto.ativo : status === "inativo" ? !produto.ativo : true;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [produtos, search, category, status]);

  return (
    <>
      <DashboardHeader
        title="Produtos"
        description="Cadastre, edite, destaque e publique os acessorios do catalogo."
        action={<Link href="/dashboard/produtos/novo"><Button>+ Adicionar produto</Button></Link>}
      />
      <ProductFilters categorias={categorias} search={search} category={category} status={status} onSearch={setSearch} onCategory={setCategory} onStatus={setStatus} />
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {loja ? filtered.map((produto) => <ProductAdminCard key={produto.id} produto={produto} lojaId={loja.id} onChanged={load} />) : null}
      </div>
    </>
  );
}

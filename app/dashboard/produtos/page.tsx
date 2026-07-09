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
  const [order, setOrder] = useState("recentes");

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
    return [...produtos].filter((produto) => {
      const minStock = produto.estoque_minimo ?? 2;
      const matchSearch = `${produto.nome} ${produto.sku ?? ""} ${produto.colecao ?? ""}`.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category ? produto.categoria_id === category : true;
      const matchStatus =
        status === "ativo" ? produto.ativo :
        status === "inativo" ? !produto.ativo :
        status === "destaque" ? produto.destaque :
        status === "sem-destaque" ? !produto.destaque :
        status === "estoque-baixo" ? produto.estoque != null && produto.estoque > 0 && produto.estoque <= minStock :
        status === "estoque-zerado" ? produto.estoque === 0 :
        status === "sem-imagem" ? !produto.imagem_url :
        status === "sem-categoria" ? !produto.categoria_id :
        status === "promocao" ? produto.preco_promocional != null && produto.preco_promocional < produto.preco :
        true;
      return matchSearch && matchCategory && matchStatus;
    }).sort((a, b) => {
      const priceA = a.preco_promocional ?? a.preco;
      const priceB = b.preco_promocional ?? b.preco;
      if (order === "antigos") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (order === "menor-preco") return priceA - priceB;
      if (order === "maior-preco") return priceB - priceA;
      if (order === "menor-estoque") return (a.estoque ?? 0) - (b.estoque ?? 0);
      if (order === "maior-estoque") return (b.estoque ?? 0) - (a.estoque ?? 0);
      if (order === "nome") return a.nome.localeCompare(b.nome);
      if (order === "destaques") return Number(b.destaque) - Number(a.destaque);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [produtos, search, category, status, order]);

  return (
    <>
      <DashboardHeader
        title="Produtos"
        description="Cadastre, edite, destaque e publique os acessórios do catálogo."
        action={<Link href="/dashboard/produtos/novo"><Button>+ Adicionar produto</Button></Link>}
      />
      <ProductFilters categorias={categorias} search={search} category={category} status={status} order={order} onSearch={setSearch} onCategory={setCategory} onStatus={setStatus} onOrder={setOrder} />
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {loja ? filtered.map((produto) => <ProductAdminCard key={produto.id} produto={produto} lojaId={loja.id} onChanged={load} />) : null}
      </div>
      {loja && !filtered.length ? (
        <div className="mt-6 rounded-[28px] border border-[#E7D8C5] bg-white/75 p-8 text-center shadow-soft">
          <h2 className="font-serif text-3xl text-preto">Nenhum produto encontrado</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-texto">Ajuste os filtros ou cadastre seus primeiros acessórios para começar a montar a vitrine da loja.</p>
          <Link href="/dashboard/produtos/novo" className="mt-5 inline-flex">
            <Button>Cadastrar produto</Button>
          </Link>
        </div>
      ) : null}
    </>
  );
}

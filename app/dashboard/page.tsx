import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, Eye, MessageCircle, Package, Plus, Sparkles, Tags, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Produto } from "@/types/produto";

type PedidoEvento = {
  id: string;
  loja_id: string;
  total: number | null;
  itens: { id: string; nome: string; quantidade: number; preco: number }[] | null;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: loja } = await supabase.from("lojas").select("*").eq("user_id", userData.user!.id).single();

  if (!loja) {
    return (
      <div className="rounded-[30px] border border-[#C9A24D]/18 bg-white/70 p-8 shadow-[0_24px_70px_rgba(80,55,25,0.08)]">
        <h1 className="font-serif text-5xl text-[#1E1D1B]">Crie sua loja</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#6F6258]">
          Nenhuma loja vinculada a este usuário foi encontrada. Crie um registro em lojas com este user_id no Supabase.
        </p>
      </div>
    );
  }

  const [{ data: produtos }, { count: totalCategorias }, { data: pedidosRecentes, error: pedidosError }] = await Promise.all([
    supabase.from("produtos").select("*, categorias(id,nome,slug)").eq("loja_id", loja.id).order("created_at", { ascending: false }),
    supabase.from("categorias").select("*", { count: "exact", head: true }).eq("loja_id", loja.id),
    supabase.from("pedido_eventos").select("*").eq("loja_id", loja.id).order("created_at", { ascending: false }).limit(25)
  ]);

  const productList = ((produtos ?? []) as Produto[]).map((product) => ({
    ...product,
    preco: Number(product.preco),
    preco_promocional: product.preco_promocional == null ? null : Number(product.preco_promocional)
  }));
  const orderEvents = pedidosError ? [] : ((pedidosRecentes ?? []) as PedidoEvento[]);
  const totalProdutos = productList.length;
  const ativos = productList.filter((product) => product.ativo).length;
  const kits = productList.filter((product) => product.tipo_produto === "kit").length;
  const baixoEstoque = productList.filter((product) => product.estoque != null && product.estoque <= 3).length;
  const valorVitrine = productList.reduce((total, product) => total + (product.preco_promocional ?? product.preco) * Math.max(product.estoque ?? 1, 1), 0);
  const pedidosIniciados = orderEvents.length;
  const receitaIntencao = orderEvents.reduce((total, event) => total + Number(event.total ?? 0), 0);
  const produtosRanking = buildRanking(productList, orderEvents);

  return (
    <>
      <DashboardHeader
        eyebrow="Visão geral da boutique"
        title={`Olá, ${loja.nome}`}
        description="Acompanhe a saúde do catálogo, produtos mais fortes, pedidos iniciados pelo WhatsApp e pontos que merecem atenção."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/produtos/novo">
              <Button className="h-12 rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-5 shadow-[0_16px_35px_rgba(168,121,33,0.20)]">
                <Plus size={18} />
                Adicionar produto
              </Button>
            </Link>
            <Link href={`/${loja.slug}/shop`} target="_blank">
              <Button variant="ghost" className="h-12 rounded-full border-[#C9A24D]/22 bg-white/70">
                <Eye size={18} />
                Ver catálogo
              </Button>
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Produtos" value={totalProdutos} hint={`${ativos} ativos na vitrine`} icon={<Package size={20} />} />
        <StatsCard label="Categorias" value={totalCategorias ?? 0} hint={`${kits} kits cadastrados`} icon={<Tags size={20} />} />
        <StatsCard label="Valor em vitrine" value={formatPrice(valorVitrine)} hint="Estimativa pelo preço e estoque atual" icon={<TrendingUp size={20} />} />
        <StatsCard label="Pedidos WhatsApp" value={pedidosIniciados} hint={pedidosError ? "Ative a tabela de eventos para acompanhar" : `${formatPrice(receitaIntencao)} em intenção`} icon={<MessageCircle size={20} />} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-[#C9A24D]/16 bg-white/68 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Produtos mais fortes</p>
              <h2 className="mt-2 font-serif text-4xl leading-none text-[#1E1D1B]">Mais comprados e procurados</h2>
            </div>
            <BarChart3 className="text-[#A87921]" size={30} />
          </div>

          <div className="mt-6 space-y-3">
            {produtosRanking.slice(0, 5).map((product, index) => (
              <div key={product.id} className="grid gap-3 rounded-[22px] border border-[#C9A24D]/12 bg-white/64 p-4 sm:grid-cols-[42px_1fr_auto] sm:items-center">
                <span className="grid size-10 place-items-center rounded-full bg-[#F7EFE3] text-sm font-bold text-[#A87921]">{index + 1}</span>
                <div>
                  <p className="font-serif text-2xl leading-tight text-[#1E1D1B]">{product.nome}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#C9A24D]">{product.categorias?.nome ?? "Produto"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-[#A87921]">{product.metricLabel}</p>
                  <p className="mt-1 text-xs text-[#6F6258]">{formatPrice(product.preco_promocional ?? product.preco)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-[#C9A24D]/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(247,239,227,0.74))] p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Atenção rápida</p>
            <h2 className="mt-2 font-serif text-4xl leading-none text-[#1E1D1B]">Prioridades da semana</h2>
            <div className="mt-6 space-y-3">
              <Insight title="Produtos com estoque baixo" value={baixoEstoque} icon={<Boxes size={18} />} />
              <Insight title="Produtos inativos" value={totalProdutos - ativos} icon={<Package size={18} />} />
              <Insight title="Peças em destaque" value={productList.filter((product) => product.destaque).length} icon={<Sparkles size={18} />} />
            </div>
          </div>

          <div className="rounded-[30px] border border-[#C9A24D]/16 bg-white/68 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Ações rápidas</p>
            <div className="mt-5 grid gap-3">
              <QuickLink href="/dashboard/produtos/novo" title="Cadastrar novo produto" />
              <QuickLink href="/dashboard/produtos" title="Organizar produtos e destaques" />
              <QuickLink href="/dashboard/perfil" title="Atualizar WhatsApp e identidade da loja" />
              <QuickLink href="/dashboard/categorias" title="Gerenciar categorias" />
            </div>
          </div>
        </div>
      </section>

      {pedidosError ? (
        <div className="mt-6 rounded-[24px] border border-[#C9A24D]/18 bg-white/62 p-5 text-sm leading-7 text-[#6F6258]">
          Para acompanhar pedidos iniciados pelo WhatsApp e ranking real de produtos comprados, aplique a nova SQL da tabela <strong>pedido_eventos</strong> no Supabase.
        </div>
      ) : null}
    </>
  );
}

function buildRanking(products: Produto[], events: PedidoEvento[]) {
  const quantities = new Map<string, number>();
  events.forEach((event) => {
    event.itens?.forEach((item) => quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantidade));
  });

  return products
    .map((product) => {
      const sold = quantities.get(product.id) ?? 0;
      const fallbackScore = (product.destaque ? 4 : 0) + (product.tipo_produto === "kit" ? 2 : 0) + Math.max(0, 10 - (product.ordem ?? 10));
      return {
        ...product,
        score: sold > 0 ? sold + 1000 : fallbackScore,
        metricLabel: sold > 0 ? `${sold} no carrinho` : product.destaque ? "Destaque" : "Potencial"
      };
    })
    .sort((a, b) => b.score - a.score);
}

function Insight({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-[20px] border border-[#C9A24D]/12 bg-white/62 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-[#F7EFE3] text-[#A87921]">{icon}</span>
        <span className="text-sm font-bold text-[#1E1D1B]">{title}</span>
      </div>
      <strong className="font-serif text-3xl font-normal text-[#A87921]">{value}</strong>
    </div>
  );
}

function QuickLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-[20px] border border-[#C9A24D]/12 bg-white/62 px-4 py-3 text-sm font-bold text-[#1E1D1B] transition hover:-translate-y-0.5 hover:border-[#C9A24D]/28 hover:bg-white">
      {title}
      <ArrowUpRight size={17} className="text-[#A87921]" />
    </Link>
  );
}

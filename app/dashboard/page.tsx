import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Boxes, CameraOff, Eye, MessageCircle, Package, Plus, Sparkles, Tags, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";

type PedidoEvento = {
  id: string;
  loja_id: string;
  origem: string;
  event_type?: string | null;
  produto_id?: string | null;
  total: number | null;
  itens: { id: string; nome: string; quantidade: number; preco: number; imagem_url?: string | null }[] | null;
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
        <p className="mt-3 max-w-2xl leading-7 text-[#6F6258]">Nenhuma loja vinculada a este usuário foi encontrada. Crie um registro em lojas com este user_id no Supabase.</p>
      </div>
    );
  }

  const [{ data: produtos }, { data: categorias }, { data: eventos, error: eventosError }] = await Promise.all([
    supabase.from("produtos").select("*, categorias(id,nome,slug)").eq("loja_id", loja.id).order("created_at", { ascending: false }),
    supabase.from("categorias").select("*").eq("loja_id", loja.id).order("ordem"),
    supabase.from("pedido_eventos").select("*").eq("loja_id", loja.id).order("created_at", { ascending: false }).limit(200)
  ]);

  const productList = ((produtos ?? []) as Produto[]).map((product) => ({
    ...product,
    preco: Number(product.preco),
    preco_promocional: product.preco_promocional == null ? null : Number(product.preco_promocional),
    preco_custo: product.preco_custo == null ? null : Number(product.preco_custo)
  }));
  const categoryList = (categorias ?? []) as Categoria[];
  const eventList = eventosError ? [] : ((eventos ?? []) as PedidoEvento[]);

  const ativos = productList.filter((product) => product.ativo);
  const inactive = productList.length - ativos.length;
  const activeCategories = categoryList.filter((category) => category.ativa);
  const lowStock = ativos.filter((product) => product.estoque != null && product.estoque > 0 && product.estoque <= (product.estoque_minimo ?? 2));
  const outStock = ativos.filter((product) => product.estoque === 0);
  const noImage = ativos.filter((product) => !product.imagem_url);
  const noCategory = ativos.filter((product) => !product.categoria_id);
  const noDescription = ativos.filter((product) => !product.descricao);
  const featured = ativos.filter((product) => product.destaque);
  const valueInCatalog = ativos.reduce((total, product) => total + (product.preco_promocional ?? product.preco) * Math.max(product.estoque ?? 1, 0), 0);
  const whatsappClicks = eventList.filter((event) => event.event_type === "click_whatsapp" || !event.event_type).length;
  const views = eventList.filter((event) => event.event_type === "view_catalog" || event.event_type === "view_product").length;
  const conversion = views ? Math.round((whatsappClicks / views) * 100) : null;
  const ranking = buildRanking(productList, eventList);
  const completionItems = [
    Boolean(loja.logo_url),
    Boolean(loja.capa_url),
    Boolean(loja.capa_mobile_url),
    Boolean(loja.whatsapp),
    Boolean(loja.instagram),
    activeCategories.length > 0,
    ativos.length >= 6,
    Boolean(loja.sobre_loja),
    Boolean(loja.sobre_imagem_url),
    Boolean(loja.dona_nome),
    Boolean(loja.dona_foto_url),
    Boolean(loja.tipo_atendimento || loja.cidade)
  ];
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  return (
    <>
      <DashboardHeader
        eyebrow="Visão geral da boutique"
        title={`Olá, ${loja.nome}`}
        description="Acompanhe a saúde do catálogo, os produtos mais fortes e os pontos que merecem atenção antes de divulgar."
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Produtos ativos" value={ativos.length} hint={inactive ? `${inactive} inativos para revisar` : "publicados na vitrine"} icon={<Package size={20} />} />
        <StatsCard label="Categorias ativas" value={activeCategories.length} hint="organizando sua vitrine" icon={<Tags size={20} />} />
        <StatsCard label="Valor em vitrine" value={formatPrice(valueInCatalog)} hint="estimativa pelo preço e estoque atual" icon={<BarChart3 size={20} />} />
        <StatsCard label="Cliques no WhatsApp" value={whatsappClicks} hint="intenções de compra geradas pelo catálogo" icon={<MessageCircle size={20} />} />
        <StatsCard label="Estoque baixo" value={lowStock.length} hint={`${outStock.length} produto(s) esgotado(s)`} icon={<Boxes size={20} />} />
        <StatsCard label="Produtos sem foto" value={noImage.length} hint="ativos que precisam de imagem principal" icon={<CameraOff size={20} />} />
      </section>

      <section className="mt-6 rounded-[30px] border border-[#C9A24D]/16 bg-white/68 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Pronto para divulgar</p>
            <h2 className="mt-2 font-serif text-3xl leading-none text-[#1E1D1B]">Seu catálogo está {completion}% completo</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F6258]">Cadastre imagens, produtos e informações de atendimento para aumentar a confiança da cliente.</p>
          </div>
          <div className="min-w-[220px]">
            <div className="h-3 overflow-hidden rounded-full bg-[#F5EDE2]">
              <div className="h-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)]" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#6F6258]">{conversion == null ? "Conversão será calculada quando houver visitas registradas." : `Conversão aproximada: ${conversion}% visita → WhatsApp`}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-[#C9A24D]/16 bg-white/68 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Produtos mais fortes</p>
              <h2 className="mt-2 font-serif text-4xl leading-none text-[#1E1D1B]">Mais procurados</h2>
            </div>
            <BarChart3 className="text-[#A87921]" size={30} />
          </div>

          <div className="mt-6 space-y-3">
            {ranking.length ? ranking.slice(0, 5).map((product, index) => (
              <div key={product.id} className="grid gap-3 rounded-[22px] border border-[#C9A24D]/12 bg-white/64 p-4 sm:grid-cols-[42px_64px_1fr_auto] sm:items-center">
                <span className="grid size-10 place-items-center rounded-full bg-[#F7EFE3] text-sm font-bold text-[#A87921]">{index + 1}</span>
                <div className="relative size-16 overflow-hidden rounded-2xl bg-bege">
                  {product.imagem_url ? <Image src={product.imagem_url} alt={product.nome} fill className="object-cover" /> : <CameraOff className="m-5 text-texto/40" />}
                </div>
                <div>
                  <p className="font-serif text-2xl leading-tight text-[#1E1D1B]">{product.nome}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#C9A24D]">{product.categorias?.nome ?? "Sem categoria"}</p>
                  <p className="mt-1 text-xs text-[#6F6258]">Estoque: {product.estoque ?? "não informado"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-[#A87921]">{product.metricLabel}</p>
                  <p className="mt-1 text-xs text-[#6F6258]">{formatPrice(product.preco_promocional ?? product.preco)}</p>
                </div>
              </div>
            )) : (
              <p className="rounded-[22px] bg-bege p-5 text-sm leading-6 text-texto">Os produtos mais procurados aparecerão aqui conforme as clientes interagirem com o catálogo.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-[#C9A24D]/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(247,239,227,0.74))] p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Atenção rápida</p>
            <h2 className="mt-2 font-serif text-4xl leading-none text-[#1E1D1B]">Prioridades da semana</h2>
            <div className="mt-6 space-y-3">
              <Priority title="Produtos com estoque baixo" value={lowStock.length} href="/dashboard/produtos" />
              <Priority title="Produtos sem imagem principal" value={noImage.length} href="/dashboard/produtos" />
              <Priority title="Produtos inativos" value={inactive} href="/dashboard/produtos" />
              <Priority title="Produtos sem categoria" value={noCategory.length} href="/dashboard/produtos" />
              <Priority title="Produtos sem descrição" value={noDescription.length} href="/dashboard/produtos" />
              <Priority title="Produtos em destaque" value={featured.length} href="/dashboard/produtos" positive />
              <Priority title="Perfil da loja completo" value={completion} href="/dashboard/perfil" suffix="%" positive={completion >= 80} />
            </div>
          </div>

          <div className="rounded-[30px] border border-[#C9A24D]/16 bg-white/68 p-6 shadow-[0_24px_70px_rgba(80,55,25,0.08)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Ações rápidas</p>
            <div className="mt-5 grid gap-3">
              <QuickLink href="/dashboard/produtos/novo" title="Cadastrar novo produto" />
              <QuickLink href="/dashboard/produtos" title="Organizar produtos e destaques" />
              <QuickLink href="/dashboard/perfil" title="Completar perfil da loja" />
              <QuickLink href="/dashboard/categorias" title="Gerenciar categorias" />
              <QuickLink href={`/${loja.slug}/shop`} title="Ver catálogo público" external />
            </div>
          </div>
        </div>
      </section>

      {ativos.length < 6 ? (
        <section className="mt-6 rounded-[30px] border border-[#C9A24D]/16 bg-[#FAF6EF]/80 p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Onboarding</p>
          <h2 className="mt-2 font-serif text-4xl text-preto">Monte sua vitrine em poucos passos</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["Cadastre sua primeira categoria", "Adicione pelo menos 6 produtos", "Envie uma imagem principal para cada produto", "Configure WhatsApp", "Adicione capa desktop e mobile", "Publique o catálogo"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-preto">
                <TriangleAlert size={16} className="text-[#A87921]" />
                {item}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {eventosError ? (
        <div className="mt-6 rounded-[24px] border border-[#C9A24D]/18 bg-white/62 p-5 text-sm leading-7 text-[#6F6258]">
          Para acompanhar cliques no WhatsApp e ranking real, aplique a SQL da tabela <strong>pedido_eventos</strong> no Supabase.
        </div>
      ) : null}
    </>
  );
}

function buildRanking(products: Produto[], events: PedidoEvento[]) {
  const quantities = new Map<string, number>();
  const clicks = new Map<string, number>();
  events.forEach((event) => {
    event.itens?.forEach((item) => {
      quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantidade);
      clicks.set(item.id, (clicks.get(item.id) ?? 0) + 1);
    });
  });

  return products
    .map((product) => {
      const sold = quantities.get(product.id) ?? 0;
      const productClicks = clicks.get(product.id) ?? 0;
      const fallbackScore = (product.destaque ? 4 : 0) + (product.tipo_produto === "kit" ? 2 : 0) + Math.max(0, 10 - (product.ordem ?? 10));
      return {
        ...product,
        score: sold > 0 || productClicks > 0 ? sold * 20 + productClicks + 1000 : fallbackScore,
        metricLabel: sold > 0 ? `${sold} item(ns) no carrinho` : productClicks > 0 ? `${productClicks} clique(s)` : product.destaque ? "Destaque" : "Potencial"
      };
    })
    .sort((a, b) => b.score - a.score);
}

function Priority({ title, value, href, suffix = "", positive }: { title: string; value: number; href: string; suffix?: string; positive?: boolean }) {
  const needsAction = !positive && value > 0;
  return (
    <Link href={href} className="flex items-center justify-between gap-3 rounded-[20px] border border-[#C9A24D]/12 bg-white/62 px-4 py-3 transition hover:-translate-y-0.5 hover:border-[#C9A24D]/30">
      <span className="text-sm font-bold text-[#1E1D1B]">{title}</span>
      <span className={`rounded-full px-3 py-1 text-sm font-bold ${needsAction ? "bg-amber-50 text-amber-700" : "bg-[#F7EFE3] text-[#A87921]"}`}>{value}{suffix}</span>
    </Link>
  );
}

function QuickLink({ href, title, external }: { href: string; title: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined} className="flex items-center justify-between rounded-[20px] border border-[#C9A24D]/12 bg-white/62 px-4 py-3 text-sm font-bold text-[#1E1D1B] transition hover:-translate-y-0.5 hover:border-[#C9A24D]/28 hover:bg-white">
      {title}
      <ArrowUpRight size={17} className="text-[#A87921]" />
    </Link>
  );
}

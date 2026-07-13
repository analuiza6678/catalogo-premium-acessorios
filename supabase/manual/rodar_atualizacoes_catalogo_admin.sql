-- Rode este SQL no Supabase SQL Editor se o painel administrativo não salvar
-- perfil da loja, produtos, imagens, cores ou informações de atendimento.
-- Ele é seguro para rodar mais de uma vez.

alter table public.lojas
  add column if not exists sobre_loja text,
  add column if not exists estilo_loja text,
  add column if not exists diferencial_1 text,
  add column if not exists diferencial_2 text,
  add column if not exists diferencial_3 text,
  add column if not exists dona_nome text,
  add column if not exists dona_foto_url text,
  add column if not exists dona_historia text,
  add column if not exists dona_instagram text,
  add column if not exists endereco text,
  add column if not exists cidade text,
  add column if not exists estado text,
  add column if not exists horario_atendimento text,
  add column if not exists link_maps text,
  add column if not exists tipo_atendimento text,
  add column if not exists capa_mobile_url text,
  add column if not exists sobre_imagem_url text,
  add column if not exists cor_fundo text default '#FAF6EF',
  add column if not exists cor_botoes text default '#D4AF37',
  add column if not exists cor_texto text default '#1E1D1B',
  add column if not exists formas_entrega text,
  add column if not exists formas_pagamento text,
  add column if not exists politica_troca text,
  add column if not exists prazo_envio text;

alter table public.produtos
  add column if not exists tipo_produto text default 'produto',
  add column if not exists badge text,
  add column if not exists observacao text,
  add column if not exists colecao text,
  add column if not exists material text,
  add column if not exists banho_cor text,
  add column if not exists medidas text,
  add column if not exists peso text,
  add column if not exists tamanho text,
  add column if not exists fechamento text,
  add column if not exists cuidados text,
  add column if not exists preco_custo numeric(10,2),
  add column if not exists promocao_inicio date,
  add column if not exists promocao_fim date,
  add column if not exists estoque_minimo integer default 2,
  add column if not exists codigo_interno text,
  add column if not exists whatsapp_mensagem text,
  add column if not exists seo_titulo text,
  add column if not exists seo_descricao text,
  add column if not exists tags text[],
  add column if not exists ocasiao text;

alter table public.categorias
  add column if not exists imagem_url text,
  add column if not exists icone text;

create table if not exists public.pedido_eventos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  produto_id uuid references public.produtos(id) on delete set null,
  origem text not null default 'carrinho',
  event_type text default 'click_whatsapp',
  itens jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table public.pedido_eventos
  add column if not exists event_type text default 'click_whatsapp',
  add column if not exists produto_id uuid references public.produtos(id) on delete set null,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.pedido_eventos enable row level security;

drop policy if exists "Public can insert pedido eventos" on public.pedido_eventos;
create policy "Public can insert pedido eventos"
on public.pedido_eventos for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.lojas
    where lojas.id = pedido_eventos.loja_id
      and lojas.ativa = true
  )
);

drop policy if exists "Owners can read pedido eventos" on public.pedido_eventos;
create policy "Owners can read pedido eventos"
on public.pedido_eventos for select
to authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = pedido_eventos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

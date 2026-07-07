create table if not exists public.pedido_eventos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  origem text not null default 'carrinho' check (origem in ('carrinho', 'produto')),
  itens jsonb not null default '[]'::jsonb,
  total numeric(10,2) not null default 0,
  created_at timestamp with time zone not null default now()
);

create index if not exists pedido_eventos_loja_created_idx
  on public.pedido_eventos (loja_id, created_at desc);

alter table public.pedido_eventos enable row level security;

grant select on public.pedido_eventos to authenticated;
grant insert on public.pedido_eventos to anon, authenticated;

drop policy if exists "Leitura do dono da loja" on public.pedido_eventos;
create policy "Leitura do dono da loja"
on public.pedido_eventos
for select
to authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = pedido_eventos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Registro publico de pedido pelo catalogo" on public.pedido_eventos;
create policy "Registro publico de pedido pelo catalogo"
on public.pedido_eventos
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.lojas
    where lojas.id = pedido_eventos.loja_id
      and lojas.ativa = true
  )
);

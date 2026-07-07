create extension if not exists "pgcrypto";

create table if not exists public.lojas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  slug text unique not null,
  descricao text,
  whatsapp text,
  instagram text,
  logo_url text,
  capa_url text,
  cor_principal text default '#F8DDEB',
  cor_secundaria text default '#D4AF37',
  ativa boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  nome text not null,
  slug text not null,
  descricao text,
  ativa boolean default true,
  ordem integer default 0,
  created_at timestamptz default now(),
  unique (loja_id, slug)
);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  categoria_id uuid references public.categorias(id) on delete set null,
  nome text not null,
  slug text not null,
  descricao text,
  detalhes text,
  preco numeric(10,2) not null check (preco > 0),
  preco_promocional numeric(10,2),
  imagem_url text,
  galeria_urls text[],
  ativo boolean default true,
  destaque boolean default false,
  estoque integer,
  sku text,
  ordem integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (loja_id, slug)
);

create index if not exists categorias_loja_id_idx on public.categorias(loja_id);
create index if not exists produtos_loja_id_idx on public.produtos(loja_id);
create index if not exists produtos_categoria_id_idx on public.produtos(categoria_id);
create index if not exists produtos_public_idx on public.produtos(loja_id, ativo, destaque, ordem);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists produtos_set_updated_at on public.produtos;
create trigger produtos_set_updated_at
before update on public.produtos
for each row execute function public.set_updated_at();

alter table public.lojas enable row level security;
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.lojas to anon, authenticated;
grant select on public.categorias to anon, authenticated;
grant select on public.produtos to anon, authenticated;
grant insert, update, delete on public.lojas to authenticated;
grant insert, update, delete on public.categorias to authenticated;
grant insert, update, delete on public.produtos to authenticated;

drop policy if exists "Public can read active stores" on public.lojas;
create policy "Public can read active stores"
on public.lojas for select
to anon, authenticated
using (ativa = true);

drop policy if exists "Owners can read own stores" on public.lojas;
create policy "Owners can read own stores"
on public.lojas for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Owners can insert own stores" on public.lojas;
create policy "Owners can insert own stores"
on public.lojas for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Owners can update own stores" on public.lojas;
create policy "Owners can update own stores"
on public.lojas for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Public can read active categories from active stores" on public.categorias;
create policy "Public can read active categories from active stores"
on public.categorias for select
to anon, authenticated
using (
  ativa = true
  and exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.ativa = true
  )
);

drop policy if exists "Owners can read own categories" on public.categorias;
create policy "Owners can read own categories"
on public.categorias for select
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can insert own categories" on public.categorias;
create policy "Owners can insert own categories"
on public.categorias for insert
to authenticated
with check (
  exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can update own categories" on public.categorias;
create policy "Owners can update own categories"
on public.categorias for update
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can delete own categories" on public.categorias;
create policy "Owners can delete own categories"
on public.categorias for delete
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = categorias.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Public can read active products from active stores" on public.produtos;
create policy "Public can read active products from active stores"
on public.produtos for select
to anon, authenticated
using (
  ativo = true
  and exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.ativa = true
  )
);

drop policy if exists "Owners can read own products" on public.produtos;
create policy "Owners can read own products"
on public.produtos for select
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can insert own products" on public.produtos;
create policy "Owners can insert own products"
on public.produtos for insert
to authenticated
with check (
  exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can update own products" on public.produtos;
create policy "Owners can update own products"
on public.produtos for update
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can delete own products" on public.produtos;
create policy "Owners can delete own products"
on public.produtos for delete
to authenticated
using (
  exists (
    select 1 from public.lojas
    where lojas.id = produtos.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('lojas', 'lojas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('produtos', 'produtos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read store images" on storage.objects;
create policy "Public can read store images"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('lojas', 'produtos'));

drop policy if exists "Owners can insert store images" on storage.objects;
create policy "Owners can insert store images"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('lojas', 'produtos')
  and exists (
    select 1 from public.lojas
    where lojas.id = ((storage.foldername(name))[1])::uuid
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can update store images" on storage.objects;
create policy "Owners can update store images"
on storage.objects for update
to authenticated
using (
  bucket_id in ('lojas', 'produtos')
  and exists (
    select 1 from public.lojas
    where lojas.id = ((storage.foldername(name))[1])::uuid
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  bucket_id in ('lojas', 'produtos')
  and exists (
    select 1 from public.lojas
    where lojas.id = ((storage.foldername(name))[1])::uuid
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can delete store images" on storage.objects;
create policy "Owners can delete store images"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('lojas', 'produtos')
  and exists (
    select 1 from public.lojas
    where lojas.id = ((storage.foldername(name))[1])::uuid
      and lojas.user_id = (select auth.uid())
  )
);

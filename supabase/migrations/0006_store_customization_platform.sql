create table if not exists public.store_theme (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null unique references public.lojas(id) on delete cascade,
  primary_color text not null default '#C9A24D',
  secondary_color text not null default '#F8DDEB',
  background_color text not null default '#FAF6EF',
  surface_color text not null default '#FFFFFF',
  text_color text not null default '#1E1D1B',
  muted_text_color text not null default '#6F6258',
  button_color text not null default '#C9A24D',
  button_text_color text not null default '#FFFFFF',
  border_color text not null default 'rgba(201,162,77,0.24)',
  promotion_color text not null default '#A87921',
  warning_color text not null default '#B45309',
  success_color text not null default '#15803D',
  heading_font text not null default 'Cormorant Garamond',
  body_font text not null default 'Inter',
  button_style text not null default 'rounded',
  card_style text not null default 'boutique',
  border_radius integer not null default 24,
  shadow_style text not null default 'soft',
  updated_at timestamptz not null default now()
);

create table if not exists public.store_sections (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  type text not null,
  enabled boolean not null default true,
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  styles jsonb not null default '{}'::jsonb,
  draft_content jsonb,
  draft_styles jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_sections_unique_type unique (loja_id, type)
);

create table if not exists public.store_revisions (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references public.lojas(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  snapshot jsonb not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.store_theme enable row level security;
alter table public.store_sections enable row level security;
alter table public.store_revisions enable row level security;

grant select on public.store_theme to anon, authenticated;
grant select on public.store_sections to anon, authenticated;
grant select on public.store_revisions to authenticated;
grant insert, update, delete on public.store_theme to authenticated;
grant insert, update, delete on public.store_sections to authenticated;
grant insert, update, delete on public.store_revisions to authenticated;

drop policy if exists "Public can read published store theme" on public.store_theme;
create policy "Public can read published store theme"
on public.store_theme
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_theme.loja_id
      and lojas.ativa = true
  )
);

drop policy if exists "Owners can manage store theme" on public.store_theme;
create policy "Owners can manage store theme"
on public.store_theme
for all
to authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_theme.loja_id
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_theme.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Public can read enabled store sections" on public.store_sections;
create policy "Public can read enabled store sections"
on public.store_sections
for select
to anon, authenticated
using (
  enabled = true
  and exists (
    select 1
    from public.lojas
    where lojas.id = store_sections.loja_id
      and lojas.ativa = true
  )
);

drop policy if exists "Owners can manage store sections" on public.store_sections;
create policy "Owners can manage store sections"
on public.store_sections
for all
to authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_sections.loja_id
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_sections.loja_id
      and lojas.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners can manage store revisions" on public.store_revisions;
create policy "Owners can manage store revisions"
on public.store_revisions
for all
to authenticated
using (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_revisions.loja_id
      and lojas.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.lojas
    where lojas.id = store_revisions.loja_id
      and lojas.user_id = (select auth.uid())
  )
);


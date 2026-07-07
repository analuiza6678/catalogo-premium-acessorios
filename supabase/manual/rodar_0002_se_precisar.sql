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
  add column if not exists tipo_atendimento text;

alter table public.produtos
  add column if not exists tipo_produto text default 'produto',
  add column if not exists badge text,
  add column if not exists observacao text;

update public.produtos
set tipo_produto = 'produto'
where tipo_produto is null;

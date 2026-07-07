alter table public.lojas
  add column if not exists capa_mobile_url text,
  add column if not exists sobre_imagem_url text;

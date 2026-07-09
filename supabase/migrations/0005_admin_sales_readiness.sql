alter table public.produtos
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

alter table public.lojas
  add column if not exists cor_fundo text default '#FAF6EF',
  add column if not exists cor_botoes text default '#D4AF37',
  add column if not exists cor_texto text default '#1E1D1B',
  add column if not exists formas_entrega text,
  add column if not exists formas_pagamento text,
  add column if not exists politica_troca text,
  add column if not exists prazo_envio text;

alter table public.categorias
  add column if not exists imagem_url text,
  add column if not exists icone text;

alter table public.pedido_eventos
  add column if not exists event_type text default 'click_whatsapp',
  add column if not exists produto_id uuid references public.produtos(id) on delete set null,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

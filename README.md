# Catalogo Premium de Acessorios

Sistema de catalogo online para loja de acessorios femininos, com painel administrativo privado, carrinho no navegador e finalizacao de pedidos pelo WhatsApp.

## Stack

- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Auth
- Supabase Storage
- Zustand para carrinho
- Motion para animacoes
- Lucide React para icones

## Requisitos

- Node.js 20 LTS recomendado
- npm
- Projeto Supabase criado

O projeto tambem pode rodar em Node.js 18.17 ou superior, mas Node 20 LTS e a opcao mais segura para deploy.

## Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-ou-anon
```

Nao use `service_role`, secret key ou senha privada em variaveis `NEXT_PUBLIC_`, porque elas ficam disponiveis no navegador.

## Instalar e Rodar Localmente

Instalar dependencias:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev -- -p 3004
```

Abrir:

```text
http://localhost:3004/login
http://localhost:3004/minha-loja/shop
```

Gerar build de producao:

```bash
npm run build
```

Rodar build localmente:

```bash
npm run start
```

## Banco de Dados

O projeto usa Supabase Postgres.

Tabelas principais:

- `lojas`: dados da loja, slug, WhatsApp, Instagram, textos institucionais, aparencia e status.
- `categorias`: categorias da loja.
- `produtos`: produtos, kits, precos, imagens, estoque e status.
- `pedido_eventos`: eventos de interesse/pedido iniciados pelo catalogo para metricas do dashboard.

Migrations SQL:

- `supabase/migrations/0001_catalogo_premium.sql`
- `supabase/migrations/0002_catalogo_premium_sections.sql`
- `supabase/migrations/0003_pedido_eventos.sql`

Para configurar o banco, abra o SQL Editor do Supabase e execute as migrations na ordem acima.

## Auth

O painel administrativo usa Supabase Auth.

Rotas privadas:

- `/dashboard`
- `/dashboard/perfil`
- `/dashboard/categorias`
- `/dashboard/produtos`
- `/dashboard/produtos/novo`
- `/dashboard/produtos/editar/[id]`

Rotas publicas:

- `/login`
- `/reset-password`
- `/[slug]/shop`
- `/[slug]/shop/categoria/[categoriaSlug]`
- `/[slug]/shop/produto/[produtoSlug]`

Para recuperacao de senha, configure no Supabase:

Authentication > URL Configuration > Redirect URLs:

```text
http://localhost:3004/reset-password
https://seu-dominio.vercel.app/reset-password
```

## Criar Usuario Admin com Seguranca

1. No Supabase, abra Authentication > Users.
2. Crie um usuario com e-mail e senha forte.
3. Copie o `UID` do usuario.
4. Insira uma loja em `public.lojas` usando esse `UID` em `user_id`.
5. O painel sempre busca a loja pelo usuario logado, entao o formulario nao aceita `loja_id` manual.

Exemplo:

```sql
insert into public.lojas (user_id, nome, slug, descricao, whatsapp, instagram, ativa)
values (
  'UID_DO_USUARIO_AQUI',
  'Minha Loja',
  'minha-loja',
  'Acessorios femininos delicados e sofisticados.',
  '5599999999999',
  '@minhaloja',
  true
);
```

## Upload de Imagens

O upload usa Supabase Storage.

Buckets:

- `lojas`
- `produtos`

Formatos aceitos:

- JPG
- PNG
- WEBP

Limite:

- 5MB por arquivo

As URLs publicas das imagens sao salvas nas tabelas `lojas` e `produtos`.

## Deploy Recomendado

Recomendacao: Vercel + Supabase.

Motivo:

- O projeto e Next.js com App Router.
- A Vercel tem suporte nativo ao Next.js.
- O Supabase continua como banco, auth e storage.
- Nao precisa configurar output manual.

### Passo a Passo

1. Suba o projeto para o GitHub.
2. No Supabase, execute as migrations SQL.
3. No Supabase, crie os buckets `lojas` e `produtos` se ainda nao existirem.
4. No Supabase Auth, configure as URLs:

```text
Site URL: https://seu-projeto.vercel.app
Redirect URL: https://seu-projeto.vercel.app/reset-password
```

5. Na Vercel, importe o repositorio do GitHub.
6. Configure:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: deixe vazio
Install Command: npm install
```

7. Adicione as variaveis de ambiente na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

8. Faca o deploy.
9. Crie o usuario admin no Supabase Auth.
10. Cadastre a loja vinculada ao `user_id` do admin.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Estrutura Principal

```text
app/
  [slug]/shop/
  dashboard/
  login/
  reset-password/
components/
  catalogo/
  dashboard/
  categorias/
  perfil/
  produtos/
  ui/
lib/
  analytics/
  cart/
  mock/
  supabase/
  utils/
public/
supabase/migrations/
types/
```

## Observacoes de Seguranca

- `.env.local` nao deve ir para o GitHub.
- `.gitignore` ja ignora `.env`, `.env*.local`, `.next` e `node_modules`.
- Nunca publique `service_role`, secret key ou senha privada.
- O projeto usa RLS nas tabelas principais e policies para separar catalogo publico do painel privado.

"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, Edit, ImageOff, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/formatPrice";
import { slugify } from "@/lib/utils/slugify";
import type { Produto } from "@/types/produto";

type ProductAdminCardProps = {
  produto: Produto;
  lojaId: string;
  onChanged: () => void;
};

export function ProductAdminCard({ produto, lojaId, onChanged }: ProductAdminCardProps) {
  const minStock = produto.estoque_minimo ?? 2;
  const isOut = produto.estoque === 0;
  const isLow = produto.estoque != null && produto.estoque > 0 && produto.estoque <= minStock;
  const hasPromo = produto.preco_promocional != null && produto.preco_promocional < produto.preco;

  async function toggle(field: "ativo" | "destaque", value: boolean) {
    const { error } = await createClient().from("produtos").update({ [field]: value }).eq("id", produto.id).eq("loja_id", lojaId);
    if (error) toast.error("Não foi possível atualizar o produto.");
    else toast.success(field === "ativo" ? "Status atualizado." : "Destaque atualizado.");
    onChanged();
  }

  async function duplicate() {
    const { id: _id, created_at: _created, updated_at: _updated, categorias: _categoria, ...copy } = produto;
    const slug = `${slugify(produto.nome)}-copia-${Date.now()}`;
    const { error } = await createClient().from("produtos").insert({
      ...copy,
      loja_id: lojaId,
      nome: `${produto.nome} - cópia`,
      slug,
      ativo: false,
      destaque: false
    });
    if (error) toast.error("Não foi possível duplicar o produto.");
    else toast.success("Produto duplicado como inativo.");
    onChanged();
  }

  async function remove() {
    if (!confirm("Excluir produto?\n\nEssa ação removerá o produto do catálogo. Você não poderá desfazer.")) return;
    const { error } = await createClient().from("produtos").delete().eq("id", produto.id).eq("loja_id", lojaId);
    if (error) toast.error("Não foi possível excluir o produto.");
    else toast.success("Produto excluído com sucesso.");
    onChanged();
  }

  return (
    <Card className="overflow-hidden p-3">
      <div className="flex gap-4">
        <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-2xl bg-bege">
          {produto.imagem_url ? <Image src={produto.imagem_url} alt={produto.nome} fill className="object-cover" /> : (
            <div className="grid h-full place-items-center text-texto/45">
              <ImageOff size={28} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{produto.ativo ? "Ativo" : "Inativo"}</Badge>
            {produto.destaque ? <Badge className="bg-dourado text-white">Destaque</Badge> : null}
            {hasPromo ? <Badge className="bg-rose-50 text-rose-700">Promoção</Badge> : null}
            {!produto.imagem_url ? <Badge className="bg-amber-50 text-amber-700">Sem foto</Badge> : null}
            {isOut ? <Badge className="bg-red-50 text-red-700">Esgotado</Badge> : null}
            {isLow ? <Badge className="bg-orange-50 text-orange-700">Estoque baixo</Badge> : null}
          </div>
          <h3 className="mt-2 line-clamp-2 font-serif text-2xl leading-tight text-preto">{produto.nome}</h3>
          <p className="text-sm text-texto">{produto.categorias?.nome ?? "Sem categoria"} {produto.sku ? `• SKU ${produto.sku}` : ""}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="font-bold text-dourado">{formatPrice(produto.preco_promocional ?? produto.preco)}</p>
            {produto.preco_promocional ? <span className="text-sm text-texto/50 line-through">{formatPrice(produto.preco)}</span> : null}
            <span className="rounded-full bg-bege px-3 py-1 text-xs font-semibold text-texto">Estoque: {produto.estoque ?? "não informado"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-texto">
            {!produto.descricao ? <Warning text="Sem descrição" /> : null}
            {!produto.categoria_id ? <Warning text="Sem categoria" /> : null}
            {produto.destaque ? <Positive text="Produto destacado" /> : null}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Switch checked={produto.ativo} onCheckedChange={(value) => toggle("ativo", value)} label="Ativo" />
        <Switch checked={produto.destaque} onCheckedChange={(value) => toggle("destaque", value)} label="Destaque" />
        <Link href={`/dashboard/produtos/editar/${produto.id}`}><Button variant="ghost"><Edit size={16} /> Editar</Button></Link>
        <Button type="button" variant="ghost" onClick={duplicate}><Copy size={16} /> Duplicar</Button>
        <Button variant="danger" onClick={remove}><Trash2 size={16} /> Excluir</Button>
      </div>
    </Card>
  );
}

function Warning({ text }: { text: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700"><TriangleAlert size={13} />{text}</span>;
}

function Positive({ text }: { text: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-[#F7EFE3] px-2.5 py-1 text-[#A87921]"><Sparkles size={13} />{text}</span>;
}

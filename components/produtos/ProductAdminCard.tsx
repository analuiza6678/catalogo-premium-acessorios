"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Produto } from "@/types/produto";

type ProductAdminCardProps = {
  produto: Produto;
  lojaId: string;
  onChanged: () => void;
};

export function ProductAdminCard({ produto, lojaId, onChanged }: ProductAdminCardProps) {
  async function toggle(field: "ativo" | "destaque", value: boolean) {
    await createClient().from("produtos").update({ [field]: value }).eq("id", produto.id).eq("loja_id", lojaId);
    onChanged();
  }

  async function remove() {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await createClient().from("produtos").delete().eq("id", produto.id).eq("loja_id", lojaId);
    onChanged();
  }

  return (
    <Card className="overflow-hidden p-3">
      <div className="flex gap-4">
        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-bege">
          {produto.imagem_url ? <Image src={produto.imagem_url} alt={produto.nome} fill className="object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{produto.ativo ? "Ativo" : "Inativo"}</Badge>
            {produto.destaque ? <Badge className="bg-dourado text-white">Destaque</Badge> : null}
          </div>
          <h3 className="mt-2 font-serif text-2xl text-preto">{produto.nome}</h3>
          <p className="text-sm text-texto">{produto.categorias?.nome ?? "Sem categoria"}</p>
          <p className="mt-1 font-bold text-dourado">{formatPrice(produto.preco_promocional ?? produto.preco)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Switch checked={produto.ativo} onCheckedChange={(value) => toggle("ativo", value)} label="Ativo" />
        <Switch checked={produto.destaque} onCheckedChange={(value) => toggle("destaque", value)} label="Destaque" />
        <Link href={`/dashboard/produtos/editar/${produto.id}`}><Button variant="ghost"><Edit size={16} /> Editar</Button></Link>
        <Button variant="danger" onClick={remove}><Trash2 size={16} /> Excluir</Button>
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import { createClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/categoria";
import { CategoryForm } from "./CategoryForm";

type CategoryAdminCardProps = {
  categoria: Categoria;
  lojaId: string;
  onChanged: () => void;
};

export function CategoryAdminCard({ categoria, lojaId, onChanged }: CategoryAdminCardProps) {
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState(categoria.ativa);

  async function toggle(value: boolean) {
    setActive(value);
    await createClient().from("categorias").update({ ativa: value }).eq("id", categoria.id).eq("loja_id", lojaId);
    onChanged();
  }

  async function remove() {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    await createClient().from("categorias").delete().eq("id", categoria.id).eq("loja_id", lojaId);
    onChanged();
  }

  return (
    <>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl text-preto">{categoria.nome}</h3>
            <p className="mt-1 text-sm text-texto">/{categoria.slug}</p>
          </div>
          <Badge className={active ? "bg-rosa-bebe" : "bg-gray-100"}>{active ? "Ativa" : "Inativa"}</Badge>
        </div>
        {categoria.descricao ? <p className="mt-3 text-sm leading-6 text-texto">{categoria.descricao}</p> : null}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Switch checked={active} onCheckedChange={toggle} />
          <Button variant="ghost" onClick={() => setEditing(true)}><Edit size={16} /> Editar</Button>
          <Button variant="danger" onClick={remove}><Trash2 size={16} /> Excluir</Button>
        </div>
      </Card>
      <Modal open={editing} title="Editar categoria" onClose={() => setEditing(false)}>
        <CategoryForm lojaId={lojaId} categoria={categoria} onSaved={() => { setEditing(false); onChanged(); }} />
      </Modal>
    </>
  );
}

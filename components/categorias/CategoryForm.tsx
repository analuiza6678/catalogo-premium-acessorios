"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { Categoria } from "@/types/categoria";

type CategoryFormProps = {
  lojaId: string;
  categoria?: Categoria | null;
  onSaved: () => void;
};

export function CategoryForm({ lojaId, categoria, onSaved }: CategoryFormProps) {
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [descricao, setDescricao] = useState(categoria?.descricao ?? "");
  const [ativa, setAtiva] = useState(categoria?.ativa ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim()) return setMessage("Nome da categoria obrigatorio.");
    setLoading(true);
    setMessage("");
    const payload = { loja_id: lojaId, nome, slug: slugify(nome), descricao: descricao || null, ativa };
    const supabase = createClient();
    const { error } = categoria
      ? await supabase.from("categorias").update(payload).eq("id", categoria.id).eq("loja_id", lojaId)
      : await supabase.from("categorias").insert(payload);
    setLoading(false);
    if (error) {
      setMessage(error.code === "23505" ? "Ja existe uma categoria com este nome." : "Nao foi possivel concluir esta acao. Tente novamente.");
      return;
    }
    setNome("");
    setDescricao("");
    setAtiva(true);
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome da categoria" />
      <Textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Descricao opcional" />
      <Switch checked={ativa} onCheckedChange={setAtiva} label={ativa ? "Categoria ativa" : "Categoria inativa"} />
      {message ? <p className="rounded-2xl bg-rosa-bebe px-4 py-3 text-sm text-preto">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Salvando..." : categoria ? "Salvar alteracoes" : "Criar categoria"}</Button>
    </form>
  );
}

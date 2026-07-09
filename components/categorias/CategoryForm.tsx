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
  const [ordem, setOrdem] = useState(String(categoria?.ordem ?? 0));
  const [icone, setIcone] = useState(categoria?.icone ?? "");
  const [imagemUrl, setImagemUrl] = useState(categoria?.imagem_url ?? "");
  const [ativa, setAtiva] = useState(categoria?.ativa ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim()) return setMessage("Nome da categoria é obrigatório.");
    setLoading(true);
    setMessage("");
    const payload = {
      loja_id: lojaId,
      nome,
      slug: slugify(nome),
      descricao: descricao || null,
      ativa,
      ordem: Number(ordem) || 0,
      icone: icone || null,
      imagem_url: imagemUrl || null
    };
    const supabase = createClient();
    const { error } = categoria
      ? await supabase.from("categorias").update(payload).eq("id", categoria.id).eq("loja_id", lojaId)
      : await supabase.from("categorias").insert(payload);
    setLoading(false);
    if (error) {
      setMessage(error.code === "23505" ? "Já existe uma categoria com este nome." : "Não foi possível concluir esta ação. Tente novamente.");
      return;
    }
    setNome("");
    setDescricao("");
    setOrdem("0");
    setIcone("");
    setImagemUrl("");
    setAtiva(true);
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome da categoria *" required />
      <Textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Descrição curta para orientar a cliente." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={ordem} onChange={(event) => setOrdem(event.target.value)} type="number" placeholder="Ordem de exibição" />
        <Input value={icone} onChange={(event) => setIcone(event.target.value)} placeholder="Ícone opcional. Ex: sparkle" />
      </div>
      <Input value={imagemUrl} onChange={(event) => setImagemUrl(event.target.value)} placeholder="URL de imagem opcional da categoria" />
      <Switch checked={ativa} onCheckedChange={setAtiva} label={ativa ? "Categoria ativa" : "Categoria inativa"} />
      {message ? <p className="rounded-2xl bg-rosa-bebe px-4 py-3 text-sm text-preto">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Salvando..." : categoria ? "Salvar alterações" : "Criar categoria"}</Button>
    </form>
  );
}

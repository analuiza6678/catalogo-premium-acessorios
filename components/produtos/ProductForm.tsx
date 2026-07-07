"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import { uploadImage } from "@/lib/utils/uploadImage";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";

type ProductFormProps = {
  lojaId: string;
  categorias: Categoria[];
  produto?: Produto | null;
};

export function ProductForm({ lojaId, categorias, produto }: ProductFormProps) {
  const router = useRouter();
  const [principal, setPrincipal] = useState<File[]>([]);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    const categoriaId = String(form.get("categoria_id") ?? "");
    const preco = Number(form.get("preco"));
    const slug = slugify(nome);

    if (!nome || !categoriaId || !preco || preco <= 0) return setMessage("Preencha nome, categoria e preco maior que zero.");
    if (!produto?.imagem_url && !principal.length) return setMessage("Imagem principal obrigatoria.");

    setLoading(true);
    setMessage("");
    const supabase = createClient();

    try {
      const basePath = `${lojaId}/${slug}`;
      const imagem_url = principal[0]
        ? await uploadImage(supabase, "produtos", `${basePath}/principal`, principal[0])
        : produto?.imagem_url ?? null;

      const galeriaUploads = await Promise.all(
        galeria.map((file, index) => uploadImage(supabase, "produtos", `${basePath}/galeria-${index + 1}`, file))
      );

      const payload = {
        loja_id: lojaId,
        categoria_id: categoriaId,
        nome,
        slug,
        descricao: String(form.get("descricao") ?? "") || null,
        detalhes: String(form.get("detalhes") ?? "") || null,
        preco,
        preco_promocional: form.get("preco_promocional") ? Number(form.get("preco_promocional")) : null,
        imagem_url,
        galeria_urls: galeriaUploads.length ? galeriaUploads : produto?.galeria_urls ?? [],
        estoque: form.get("estoque") ? Number(form.get("estoque")) : null,
        sku: String(form.get("sku") ?? "") || null,
        ativo,
        destaque,
        tipo_produto: String(form.get("tipo_produto") ?? "produto"),
        badge: String(form.get("badge") ?? "") || null,
        observacao: String(form.get("observacao") ?? "") || null
      };

      const { error } = produto
        ? await supabase.from("produtos").update(payload).eq("id", produto.id).eq("loja_id", lojaId)
        : await supabase.from("produtos").insert(payload);

      if (error) throw error;
      router.push("/dashboard/produtos");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel concluir esta acao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Informacoes basicas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="nome" defaultValue={produto?.nome} placeholder="Nome do produto" required />
          <Select name="categoria_id" defaultValue={produto?.categoria_id ?? ""} required>
            <option value="">Selecione a categoria</option>
            {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
          </Select>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select name="tipo_produto" defaultValue={produto?.tipo_produto ?? "produto"}>
            <option value="produto">Produto</option>
            <option value="kit">Kit</option>
          </Select>
          <Select name="badge" defaultValue={produto?.badge ?? ""}>
            <option value="">Sem badge</option>
            <option value="Novo">Novo</option>
            <option value="Destaque">Destaque</option>
            <option value="Promocao">Promocao</option>
            <option value="Kit">Kit</option>
          </Select>
        </div>
        <Textarea name="descricao" defaultValue={produto?.descricao ?? ""} placeholder="Descricao curta" className="mt-4" />
        <Textarea name="detalhes" defaultValue={produto?.detalhes ?? ""} placeholder="Detalhes do produto" className="mt-4" />
        <Textarea name="observacao" defaultValue={produto?.observacao ?? ""} placeholder="Observacao opcional para o catalogo" className="mt-4" />
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Preco</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="preco" type="number" step="0.01" min="0" defaultValue={produto?.preco} placeholder="Preco" required />
          <Input name="preco_promocional" type="number" step="0.01" min="0" defaultValue={produto?.preco_promocional ?? ""} placeholder="Preco promocional" />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Imagens</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload label="Imagem principal" currentUrl={produto?.imagem_url} onFilesChange={setPrincipal} />
          <ImageUpload label="Galeria de imagens" multiple onFilesChange={setGaleria} />
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Configuracoes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="estoque" type="number" defaultValue={produto?.estoque ?? ""} placeholder="Estoque" />
          <Input name="sku" defaultValue={produto?.sku ?? ""} placeholder="SKU" />
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          <Switch checked={ativo} onCheckedChange={setAtivo} label={ativo ? "Produto ativo" : "Produto inativo"} />
          <Switch checked={destaque} onCheckedChange={setDestaque} label={destaque ? "Em destaque" : "Sem destaque"} />
        </div>
      </Card>

      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={loading}>{loading ? "Salvando..." : produto ? "Salvar alteracoes" : "Salvar produto"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/produtos")}>Cancelar</Button>
      </div>
    </form>
  );
}

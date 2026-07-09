"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MessageCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/formatPrice";
import { slugify } from "@/lib/utils/slugify";
import { uploadImage } from "@/lib/utils/uploadImage";
import type { Categoria } from "@/types/categoria";
import type { Produto } from "@/types/produto";

type ProductFormProps = {
  lojaId: string;
  lojaSlug: string;
  categorias: Categoria[];
  produto?: Produto | null;
};

type FormErrors = Record<string, string>;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String((error as { message?: unknown }).message);
  return "Não foi possível concluir esta ação. Tente novamente.";
}

function parseMoney(value: FormDataEntryValue | null) {
  const text = String(value ?? "").replace(/\./g, "").replace(",", ".").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function parseInteger(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isInteger(number) ? number : null;
}

export function ProductForm({ lojaId, lojaSlug, categorias, produto }: ProductFormProps) {
  const router = useRouter();
  const [principal, setPrincipal] = useState<File[]>([]);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [pricePreview, setPricePreview] = useState({
    preco: produto?.preco ?? 0,
    promocional: produto?.preco_promocional ?? 0,
    custo: produto?.preco_custo ?? 0
  });

  const margin = useMemo(() => {
    const salePrice = pricePreview.promocional > 0 ? pricePreview.promocional : pricePreview.preco;
    if (!salePrice || !pricePreview.custo) return null;
    return Math.round(((salePrice - pricePreview.custo) / salePrice) * 100);
  }, [pricePreview]);

  function validate(form: FormData) {
    const next: FormErrors = {};
    const nome = String(form.get("nome") ?? "").trim();
    const categoriaId = String(form.get("categoria_id") ?? "");
    const preco = parseMoney(form.get("preco"));
    const precoPromocional = parseMoney(form.get("preco_promocional"));
    const estoque = parseInteger(form.get("estoque"));

    if (!nome) next.nome = "Informe o nome do produto.";
    if (!categoriaId) next.categoria_id = "Escolha uma categoria.";
    if (preco == null || preco <= 0) next.preco = "Informe um preço de venda maior que zero.";
    if (precoPromocional != null && preco != null && precoPromocional >= preco) next.preco_promocional = "O preço promocional deve ser menor que o preço normal.";
    if (estoque == null || estoque < 0) next.estoque = "Informe um estoque válido, maior ou igual a zero.";
    if (!produto?.imagem_url && !principal.length && ativo) next.imagem_url = "Envie uma imagem principal antes de publicar.";

    setErrors(next);
    return { valid: Object.keys(next).length === 0, preco, precoPromocional, estoque };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const stayAfterSave = submitter?.value === "stay";
    const form = new FormData(event.currentTarget);
    const validation = validate(form);
    if (!validation.valid) {
      setMessage(`Verifique os campos destacados antes de salvar.`);
      toast.error("Não foi possível salvar o produto. Verifique os campos destacados.");
      return;
    }

    const nome = String(form.get("nome") ?? "").trim();
    const slug = slugify(String(form.get("slug") ?? nome));
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setLoading(true);
    setMessage("");
    const supabase = createClient();

    try {
      const basePath = `${lojaId}/${slug}`;
      const imagem_url = principal[0] ? await uploadImage(supabase, "produtos", `${basePath}/principal`, principal[0]) : produto?.imagem_url ?? null;
      const galeriaUploads = await Promise.all(galeria.map((file, index) => uploadImage(supabase, "produtos", `${basePath}/galeria-${index + 1}`, file)));

      const payload = {
        loja_id: lojaId,
        categoria_id: String(form.get("categoria_id") ?? ""),
        nome,
        slug,
        descricao: String(form.get("descricao") ?? "") || null,
        detalhes: String(form.get("detalhes") ?? "") || null,
        preco: validation.preco ?? 0,
        preco_promocional: validation.precoPromocional,
        imagem_url,
        galeria_urls: galeriaUploads.length ? galeriaUploads : produto?.galeria_urls ?? [],
        estoque: validation.estoque,
        sku: String(form.get("sku") ?? "") || null,
        ativo,
        destaque,
        ordem: parseInteger(form.get("ordem")) ?? produto?.ordem ?? 0,
        tipo_produto: String(form.get("tipo_produto") ?? "produto"),
        badge: String(form.get("badge") ?? "") || null,
        observacao: String(form.get("observacao") ?? "") || null,
        colecao: String(form.get("colecao") ?? "") || null,
        material: String(form.get("material") ?? "") || null,
        banho_cor: String(form.get("banho_cor") ?? "") || null,
        medidas: String(form.get("medidas") ?? "") || null,
        peso: String(form.get("peso") ?? "") || null,
        tamanho: String(form.get("tamanho") ?? "") || null,
        fechamento: String(form.get("fechamento") ?? "") || null,
        cuidados: String(form.get("cuidados") ?? "") || null,
        preco_custo: parseMoney(form.get("preco_custo")),
        promocao_inicio: String(form.get("promocao_inicio") ?? "") || null,
        promocao_fim: String(form.get("promocao_fim") ?? "") || null,
        estoque_minimo: parseInteger(form.get("estoque_minimo")) ?? 2,
        codigo_interno: String(form.get("codigo_interno") ?? "") || null,
        whatsapp_mensagem: String(form.get("whatsapp_mensagem") ?? "") || null,
        seo_titulo: String(form.get("seo_titulo") ?? "") || null,
        seo_descricao: String(form.get("seo_descricao") ?? "") || null,
        tags,
        ocasiao: String(form.get("ocasiao") ?? "") || null
      };

      const { data, error } = produto
        ? await supabase.from("produtos").update(payload).eq("id", produto.id).eq("loja_id", lojaId).select("id").single()
        : await supabase.from("produtos").insert(payload).select("id").single();

      if (error) throw error;
      toast.success(produto ? "Produto atualizado com sucesso." : "Produto salvo com sucesso.");
      if (stayAfterSave && data?.id) {
        router.push(`/dashboard/produtos/editar/${data.id}`);
        router.refresh();
        return;
      }
      router.push("/dashboard/produtos");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar produto", error);
      setMessage(getErrorMessage(error));
      toast.error("Não foi possível salvar o produto. Verifique os campos destacados.");
    } finally {
      setLoading(false);
    }
  }

  const whatsappDefault = produto?.whatsapp_mensagem || `Olá! Tenho interesse no produto ${produto?.nome ?? "{{nome}}"} de ${produto ? formatPrice(produto.preco_promocional ?? produto.preco) : "{{preço}}"}. Está disponível?`;
  const missingRequired = Object.keys(errors).length;

  return (
    <form onSubmit={submit} className="space-y-5">
      {missingRequired ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          Faltam {missingRequired} campo(s) obrigatório(s) para publicar este produto.
        </div>
      ) : null}

      <FormSection title="Informações básicas" description="Preencha os dados da peça e como ela aparece na vitrine.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldError error={errors.nome}>
            <Input name="nome" defaultValue={produto?.nome} placeholder="Ex: Gargantilha Estrela e Lua" required aria-invalid={Boolean(errors.nome)} />
          </FieldError>
          <FieldError error={errors.categoria_id}>
            <Select name="categoria_id" defaultValue={produto?.categoria_id ?? ""} required aria-invalid={Boolean(errors.categoria_id)}>
              <option value="">Categoria *</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </Select>
          </FieldError>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Select name="tipo_produto" defaultValue={produto?.tipo_produto ?? "produto"}>
            <option value="produto">Produto</option>
            <option value="kit">Kit</option>
          </Select>
          <Input name="colecao" defaultValue={produto?.colecao ?? ""} placeholder="Coleção. Ex: Verão Dourado" />
          <Select name="badge" defaultValue={produto?.badge ?? ""}>
            <option value="">Sem badge</option>
            <option value="Novo">Novo</option>
            <option value="Destaque">Destaque</option>
            <option value="Promoção">Promoção</option>
            <option value="Kit especial">Kit especial</option>
          </Select>
        </div>
        <Textarea name="descricao" defaultValue={produto?.descricao ?? ""} placeholder="Ex: Colar delicado com pingente de estrela e lua, ideal para composições elegantes." className="mt-4" />
        <Textarea name="detalhes" defaultValue={produto?.detalhes ?? ""} placeholder="Informe materiais, medidas, acabamento, regulagem e diferenciais da peça." className="mt-4" />
        <Textarea name="observacao" defaultValue={produto?.observacao ?? ""} placeholder="Ex: Produto artesanal, pode ter pequenas variações." className="mt-4" />
      </FormSection>

      <FormSection title="Características da peça" description="Campos opcionais que ajudam a cliente a comprar com mais confiança.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="material" defaultValue={produto?.material ?? ""} placeholder="Material. Ex: aço inox, prata 925" />
          <Input name="banho_cor" defaultValue={produto?.banho_cor ?? ""} placeholder="Banho / cor. Ex: dourado, rosé" />
          <Input name="medidas" defaultValue={produto?.medidas ?? ""} placeholder="Medidas. Ex: 45 cm + 5 cm" />
          <Input name="peso" defaultValue={produto?.peso ?? ""} placeholder="Peso. Ex: 8g" />
          <Input name="tamanho" defaultValue={produto?.tamanho ?? ""} placeholder="Tamanho. Ex: ajustável, aro 18" />
          <Input name="fechamento" defaultValue={produto?.fechamento ?? ""} placeholder="Fechamento. Ex: lagosta, tarraxa" />
        </div>
        <Textarea name="cuidados" defaultValue={produto?.cuidados ?? ""} placeholder="Ex: Evite contato com água, perfume e produtos químicos." className="mt-4" />
      </FormSection>

      <FormSection title="Preço e promoção" description="Defina preço de venda e acompanhe uma margem estimada.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldError error={errors.preco}>
            <Input name="preco" type="number" step="0.01" min="0" defaultValue={produto?.preco} placeholder="Preço de venda *" required aria-invalid={Boolean(errors.preco)} onChange={(event) => setPricePreview((current) => ({ ...current, preco: Number(event.target.value) }))} />
          </FieldError>
          <FieldError error={errors.preco_promocional}>
            <Input name="preco_promocional" type="number" step="0.01" min="0" defaultValue={produto?.preco_promocional ?? ""} placeholder="Preço promocional" aria-invalid={Boolean(errors.preco_promocional)} onChange={(event) => setPricePreview((current) => ({ ...current, promocional: Number(event.target.value) }))} />
          </FieldError>
          <Input name="preco_custo" type="number" step="0.01" min="0" defaultValue={produto?.preco_custo ?? ""} placeholder="Preço de custo" onChange={(event) => setPricePreview((current) => ({ ...current, custo: Number(event.target.value) }))} />
          <div className="rounded-2xl border border-[#E7D8C5] bg-bege px-4 py-3 text-sm">
            <span className="block text-texto">Margem estimada</span>
            <strong className="font-serif text-2xl text-dourado">{margin == null ? "—" : `${margin}%`}</strong>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="promocao_inicio" type="date" defaultValue={produto?.promocao_inicio ?? ""} />
          <Input name="promocao_fim" type="date" defaultValue={produto?.promocao_fim ?? ""} />
        </div>
      </FormSection>

      <FormSection title="Imagens" description="Use fotos claras, nítidas e sem texto por cima. Para acessórios, prefira fundo neutro e boa iluminação.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldError error={errors.imagem_url}>
            <ImageUpload label="Imagem principal *" currentUrl={produto?.imagem_url} files={principal} onFilesChange={setPrincipal} helpText="Obrigatória para publicar. JPG, PNG ou WEBP até 5MB." />
          </FieldError>
          <ImageUpload label="Galeria de imagens" multiple files={galeria} onFilesChange={setGaleria} helpText="Adicione fotos de detalhes, medidas e variações da peça." />
        </div>
      </FormSection>

      <FormSection title="Estoque e configurações" description="Defina a quantidade disponível para evitar pedidos de produtos esgotados.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldError error={errors.estoque}>
            <Input name="estoque" type="number" min="0" defaultValue={produto?.estoque ?? ""} placeholder="Estoque atual *" required aria-invalid={Boolean(errors.estoque)} />
          </FieldError>
          <Input name="estoque_minimo" type="number" min="0" defaultValue={produto?.estoque_minimo ?? 2} placeholder="Estoque mínimo" />
          <Input name="sku" defaultValue={produto?.sku ?? ""} placeholder="SKU" />
          <Input name="codigo_interno" defaultValue={produto?.codigo_interno ?? ""} placeholder="Código interno" />
          <Input name="ordem" type="number" defaultValue={produto?.ordem ?? 0} placeholder="Ordem de exibição" />
          <Input name="ocasiao" defaultValue={produto?.ocasiao ?? ""} placeholder="Ocasião. Ex: presente, festa" />
          <Input name="tags" defaultValue={produto?.tags?.join(", ") ?? ""} placeholder="Tags separadas por vírgula" className="lg:col-span-2" />
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          <Switch checked={ativo} onCheckedChange={setAtivo} label={ativo ? "Produto ativo" : "Produto inativo"} />
          <Switch checked={destaque} onCheckedChange={setDestaque} label={destaque ? "Em destaque" : "Sem destaque"} />
        </div>
      </FormSection>

      <FormSection title="Mensagem para WhatsApp" description="Essa mensagem será enviada quando a cliente demonstrar interesse no produto.">
        <Textarea name="whatsapp_mensagem" defaultValue={whatsappDefault} />
      </FormSection>

      <FormSection title="SEO e compartilhamento" description="Informações opcionais para melhorar o link compartilhado.">
        <div className="grid gap-4 sm:grid-cols-2">
            <Input name="slug" defaultValue={produto?.slug ?? ""} placeholder="Slug automático ou personalizado" />
          <Input name="seo_titulo" defaultValue={produto?.seo_titulo ?? ""} placeholder="Título para compartilhamento" />
        </div>
        <Textarea name="seo_descricao" defaultValue={produto?.seo_descricao ?? ""} placeholder="Descrição para compartilhamento" className="mt-4" />
      </FormSection>

      {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p> : null}
      <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-full border border-[#E7D8C5]/80 bg-white/85 p-2 shadow-[0_18px_50px_rgba(80,55,25,0.12)] backdrop-blur">
        <Button disabled={loading}><Save size={16} />{loading ? "Salvando..." : produto ? "Salvar alterações" : "Salvar produto"}</Button>
        <Button type="submit" name="intent" value="stay" variant="ghost" disabled={loading}>Salvar e continuar</Button>
        {produto ? (
          <Link href={`/${lojaSlug}/shop/produto/${produto.slug}`} target="_blank">
            <Button type="button" variant="ghost"><Eye size={16} />Visualizar</Button>
          </Link>
        ) : null}
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/produtos")}>Cancelar</Button>
      </div>
    </form>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 lg:p-6">
      <h2 className="font-serif text-2xl text-preto lg:text-3xl">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-texto">{description}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function FieldError({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}

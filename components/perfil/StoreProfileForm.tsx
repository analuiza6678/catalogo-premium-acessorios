"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, ExternalLink, ImageIcon, MessageCircle, PackagePlus, PlusCircle, Store, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
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
import { buildWhatsappUrl, normalizeWhatsapp } from "@/lib/utils/whatsapp";
import type { Loja } from "@/types/loja";

type StoreProfileFormProps = {
  loja: Loja;
  activeCategories: number;
  activeProducts: number;
};

type ImageKey = "logo_url" | "capa_url" | "capa_mobile_url" | "sobre_imagem_url" | "dona_foto_url";

const imageHelp = {
  logo: "Use uma imagem quadrada para a logo. Tamanho recomendado: 800x800px. Formatos: JPG, PNG ou WEBP. Máximo: 5MB.",
  capaDesktop: "Capa para computador: recomendado 1920x900px ou 1600x800px. Evite textos importantes na imagem, pois ela pode ser cortada.",
  capaMobile: "Capa para celular: recomendado 1080x1350px ou 1080x1600px. Prefira imagem vertical e sem textos importantes.",
  sobre: "Imagem usada na seção Sobre a loja. Recomendado: 1200x1400px ou 1000x1200px. Prefira fotos verticais, com boa iluminação e sem texto.",
  dona: "Foto da dona/fundadora. Recomendado: imagem vertical com rosto bem iluminado. JPG, PNG ou WEBP até 5MB."
};

function getProfileSaveErrorMessage(error: unknown) {
  const text = error instanceof Error ? error.message : "Não foi possível concluir esta ação. Tente novamente.";
  const lower = text.toLowerCase();

  if (lower.includes("mime") || lower.includes("5mb")) {
    return "Não foi possível enviar a imagem. Verifique o formato e tamanho.";
  }

  if (lower.includes("schema cache") || lower.includes("could not find") || lower.includes("column")) {
    return "O banco de dados do Supabase ainda não tem todos os campos novos do catálogo. Rode o SQL de atualização no Supabase e tente salvar novamente.";
  }

  if (lower.includes("duplicate") || lower.includes("lojas_slug_key")) {
    return "Este link da loja já está em uso. Escolha outro slug.";
  }

  if (lower.includes("row-level security") || lower.includes("permission denied")) {
    return "Seu usuário não tem permissão para alterar esta loja. Verifique se está logada com a conta dona do catálogo.";
  }

  return text;
}

export function StoreProfileForm({ loja, activeCategories, activeProducts }: StoreProfileFormProps) {
  const [logo, setLogo] = useState<File[]>([]);
  const [capa, setCapa] = useState<File[]>([]);
  const [capaMobile, setCapaMobile] = useState<File[]>([]);
  const [sobreImagem, setSobreImagem] = useState<File[]>([]);
  const [donaFoto, setDonaFoto] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<Record<ImageKey, boolean>>({
    logo_url: false,
    capa_url: false,
    capa_mobile_url: false,
    sobre_imagem_url: false,
    dona_foto_url: false
  });
  const [ativa, setAtiva] = useState(loja.ativa);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const catalogPath = `/${loja.slug}/shop`;
  const [catalogUrl, setCatalogUrl] = useState(catalogPath);
  const whatsappTestUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Estou testando o WhatsApp do catálogo da ${loja.nome}.`);

  useEffect(() => {
    setCatalogUrl(`${window.location.origin}${catalogPath}`);
  }, [catalogPath]);

  const checklist = useMemo(
    () => [
      { label: "Logo cadastrada", done: Boolean(loja.logo_url) || Boolean(logo[0]) },
      { label: "Capa desktop cadastrada", done: Boolean(loja.capa_url) || Boolean(capa[0]) },
      { label: "Capa mobile cadastrada", done: Boolean(loja.capa_mobile_url) || Boolean(capaMobile[0]) },
      { label: "WhatsApp configurado", done: Boolean(loja.whatsapp) },
      { label: "Instagram configurado", done: Boolean(loja.instagram) },
      { label: "Pelo menos 1 categoria ativa", done: activeCategories > 0 },
      { label: "Pelo menos 6 produtos ativos", done: activeProducts >= 6 },
      { label: "Sobre a loja preenchido", done: Boolean(loja.sobre_loja) },
      { label: "Imagem sobre a loja cadastrada", done: Boolean(loja.sobre_imagem_url) || Boolean(sobreImagem[0]) },
      { label: "Nome da dona preenchido", done: Boolean(loja.dona_nome) },
      { label: "Foto da dona cadastrada", done: Boolean(loja.dona_foto_url) },
      { label: "Atendimento preenchido", done: Boolean(loja.tipo_atendimento || loja.cidade || loja.formas_entrega) }
    ],
    [activeCategories, activeProducts, capa, capaMobile, logo, loja, sobreImagem]
  );
  const doneCount = checklist.filter((item) => item.done).length;
  const percent = Math.round((doneCount / checklist.length) * 100);

  function markImageRemoved(key: ImageKey) {
    setRemovedImages((current) => ({ ...current, [key]: true }));
    if (key === "logo_url") setLogo([]);
    if (key === "capa_url") setCapa([]);
    if (key === "capa_mobile_url") setCapaMobile([]);
    if (key === "sobre_imagem_url") setSobreImagem([]);
    if (key === "dona_foto_url") setDonaFoto([]);
    toast.success("Imagem removida. Clique em salvar para confirmar.");
  }

  async function copyCatalogLink() {
    await navigator.clipboard.writeText(catalogUrl);
    toast.success("Link do catálogo copiado.");
  }

  async function removeStoredFile(publicUrl?: string | null) {
    if (!publicUrl) return;
    const marker = "/storage/v1/object/public/lojas/";
    const index = publicUrl.indexOf(marker);
    if (index === -1) return;
    const path = decodeURIComponent(publicUrl.slice(index + marker.length).split("?")[0]);
    const supabase = createClient();
    // Best effort: some Storage policies allow upload/update but not delete. If delete fails,
    // the important part is still clearing the URL from the loja row.
    await supabase.storage.from("lojas").remove([path]);
  }

  async function resolveImageUrl(key: ImageKey, path: string, file: File | undefined, currentUrl?: string | null) {
    if (removedImages[key]) {
      await removeStoredFile(currentUrl).catch(() => null);
      return null;
    }
    if (!file) return currentUrl ?? null;
    await removeStoredFile(currentUrl).catch(() => null);
    const supabase = createClient();
    return uploadImage(supabase, "lojas", path, file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    const slug = slugify(String(form.get("slug") ?? nome));
    const whatsapp = normalizeWhatsapp(String(form.get("whatsapp") ?? ""));

    if (!nome || !slug || !whatsapp) {
      setMessage("Nome da loja, slug e WhatsApp são obrigatórios.");
      toast.error("Preencha nome da loja, slug e WhatsApp.");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();

    try {
      const logo_url = await resolveImageUrl("logo_url", `${loja.id}/logo/logo-${Date.now()}`, logo[0], loja.logo_url);
      const capa_url = await resolveImageUrl("capa_url", `${loja.id}/capas/desktop-${Date.now()}`, capa[0], loja.capa_url);
      const capa_mobile_url = await resolveImageUrl("capa_mobile_url", `${loja.id}/capas/mobile-${Date.now()}`, capaMobile[0], loja.capa_mobile_url);
      const sobre_imagem_url = await resolveImageUrl("sobre_imagem_url", `${loja.id}/sobre/sobre-${Date.now()}`, sobreImagem[0], loja.sobre_imagem_url);
      const dona_foto_url = await resolveImageUrl("dona_foto_url", `${loja.id}/dona/dona-${Date.now()}`, donaFoto[0], loja.dona_foto_url);

      const { error } = await supabase
        .from("lojas")
        .update({
          nome,
          slug,
          descricao: String(form.get("descricao") ?? "") || null,
          whatsapp,
          instagram: String(form.get("instagram") ?? "") || null,
          logo_url,
          capa_url,
          capa_mobile_url,
          sobre_imagem_url,
          cor_principal: String(form.get("cor_principal") ?? "#F8DDEB"),
          cor_secundaria: String(form.get("cor_secundaria") ?? "#D4AF37"),
          cor_fundo: String(form.get("cor_fundo") ?? "#FAF6EF"),
          cor_botoes: String(form.get("cor_botoes") ?? "#D4AF37"),
          cor_texto: String(form.get("cor_texto") ?? "#1E1D1B"),
          ativa,
          sobre_loja: String(form.get("sobre_loja") ?? "") || null,
          estilo_loja: String(form.get("estilo_loja") ?? "") || null,
          diferencial_1: String(form.get("diferencial_1") ?? "") || null,
          diferencial_2: String(form.get("diferencial_2") ?? "") || null,
          diferencial_3: String(form.get("diferencial_3") ?? "") || null,
          dona_nome: String(form.get("dona_nome") ?? "") || null,
          dona_foto_url,
          dona_historia: String(form.get("dona_historia") ?? "") || null,
          dona_instagram: String(form.get("dona_instagram") ?? "") || null,
          endereco: String(form.get("endereco") ?? "") || null,
          cidade: String(form.get("cidade") ?? "") || null,
          estado: String(form.get("estado") ?? "") || null,
          horario_atendimento: String(form.get("horario_atendimento") ?? "") || null,
          link_maps: String(form.get("link_maps") ?? "") || null,
          tipo_atendimento: String(form.get("tipo_atendimento") ?? "") || null,
          formas_entrega: String(form.get("formas_entrega") ?? "") || null,
          formas_pagamento: String(form.get("formas_pagamento") ?? "") || null,
          politica_troca: String(form.get("politica_troca") ?? "") || null,
          prazo_envio: String(form.get("prazo_envio") ?? "") || null
        })
        .eq("id", loja.id)
        .eq("user_id", loja.user_id);

      if (error) throw error;
      setMessage("Loja atualizada com sucesso.");
      toast.success("Loja atualizada com sucesso.");
    } catch (error) {
      const text = getProfileSaveErrorMessage(error);
      setMessage(text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card className="overflow-hidden p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-dourado">Configuração do catálogo</p>
            <h2 className="mt-2 font-serif text-3xl text-preto">Seu catálogo está {percent}% completo</h2>
            <p className="mt-1 text-sm text-texto">Complete os itens principais antes de divulgar sua loja.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickAction href={catalogPath} label="Ver catálogo" icon={ExternalLink} />
            <button type="button" onClick={copyCatalogLink} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dourado/25 bg-white px-4 text-sm font-semibold text-preto">
              <Copy size={16} />
              Copiar link
            </button>
            <QuickAction href="/dashboard/produtos/novo" label="Adicionar produto" icon={PackagePlus} />
            <QuickAction href="/dashboard/categorias" label="Adicionar categoria" icon={PlusCircle} />
            {whatsappTestUrl ? <QuickAction href={whatsappTestUrl} label="Testar WhatsApp" icon={MessageCircle} external /> : null}
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-bege">
          <div className="h-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)]" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-rosa-bebe/60 bg-bege/50 px-3 py-2 text-sm text-preto">
              <CheckCircle2 size={16} className={item.done ? "text-dourado" : "text-texto/30"} />
              {item.label}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={Store} title="Identidade da loja" description="Dados principais exibidos no catálogo e usados nos pedidos." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input name="nome" defaultValue={loja.nome} placeholder="Nome da loja" required />
          <Input name="slug" defaultValue={loja.slug} placeholder="slug-da-loja" required />
        </div>
        <Textarea name="descricao" defaultValue={loja.descricao ?? ""} placeholder="Descrição curta da loja" className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="whatsapp" defaultValue={loja.whatsapp ?? ""} placeholder="WhatsApp com DDD" required />
          <Input name="instagram" defaultValue={loja.instagram ?? ""} placeholder="Instagram" />
        </div>
        <div className="mt-4 rounded-2xl border border-dourado/15 bg-bege px-4 py-3 text-sm text-texto">
          Link do catálogo: <span className="font-semibold text-preto">{catalogUrl}</span>
        </div>
        <div className="mt-5">
          <Switch checked={ativa} onCheckedChange={setAtiva} label={ativa ? "Loja ativa" : "Loja inativa"} />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={ImageIcon} title="Logo da loja" description="Use uma logo limpa para deixar o catálogo mais profissional." />
        <div className="mt-5">
          <ImageUpload label="Logo" currentUrl={removedImages.logo_url ? null : loja.logo_url} files={logo} onFilesChange={setLogo} onRemove={() => markImageRemoved("logo_url")} helpText={imageHelp.logo} aspectClassName="aspect-square max-h-[280px]" />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={ImageIcon} title="Capa do catálogo" description="Cadastre imagens diferentes para computador e celular." />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ImageUpload label="Capa desktop" currentUrl={removedImages.capa_url ? null : loja.capa_url} files={capa} onFilesChange={setCapa} onRemove={() => markImageRemoved("capa_url")} helpText={imageHelp.capaDesktop} aspectClassName="aspect-[16/8]" />
          <ImageUpload label="Capa celular" currentUrl={removedImages.capa_mobile_url ? null : loja.capa_mobile_url} files={capaMobile} onFilesChange={setCapaMobile} onRemove={() => markImageRemoved("capa_mobile_url")} helpText={imageHelp.capaMobile} aspectClassName="aspect-[4/5]" />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={Store} title="Sobre a loja" description="Conte a história e escolha a imagem usada nessa seção do catálogo." />
        <Textarea name="sobre_loja" defaultValue={loja.sobre_loja ?? ""} placeholder="Conte a história da boutique, o estilo das peças e o que torna sua curadoria especial." className="mt-5" />
        <Textarea name="estilo_loja" defaultValue={loja.estilo_loja ?? ""} placeholder="Ex: Acessórios delicados para transformar pequenos detalhes em presença." className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input name="diferencial_1" defaultValue={loja.diferencial_1 ?? ""} placeholder="Diferencial 1" />
          <Input name="diferencial_2" defaultValue={loja.diferencial_2 ?? ""} placeholder="Diferencial 2" />
          <Input name="diferencial_3" defaultValue={loja.diferencial_3 ?? ""} placeholder="Diferencial 3" />
        </div>
        <div className="mt-5">
          <ImageUpload label="Imagem sobre a loja" currentUrl={removedImages.sobre_imagem_url ? null : loja.sobre_imagem_url} files={sobreImagem} onFilesChange={setSobreImagem} onRemove={() => markImageRemoved("sobre_imagem_url")} helpText={imageHelp.sobre} aspectClassName="aspect-[4/5] max-h-[520px]" />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={Store} title="Sobre a dona" description="Apresente quem está por trás da loja." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input name="dona_nome" defaultValue={loja.dona_nome ?? ""} placeholder="Nome da dona" />
          <Input name="dona_instagram" defaultValue={loja.dona_instagram ?? ""} placeholder="Instagram da dona" />
        </div>
        <Textarea name="dona_historia" defaultValue={loja.dona_historia ?? ""} placeholder="Conte quem está por trás da loja, sua paixão por acessórios e como escolhe cada peça." className="mt-4" />
        <div className="mt-5">
          <ImageUpload label="Foto da dona" currentUrl={removedImages.dona_foto_url ? null : loja.dona_foto_url} files={donaFoto} onFilesChange={setDonaFoto} onRemove={() => markImageRemoved("dona_foto_url")} helpText={imageHelp.dona} aspectClassName="aspect-[4/5] max-h-[520px]" />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={MessageCircle} title="Localização e atendimento" description="Explique como a cliente compra, retira ou recebe os produtos." />
        <Input name="endereco" defaultValue={loja.endereco ?? ""} placeholder="Endereço" className="mt-5" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="cidade" defaultValue={loja.cidade ?? ""} placeholder="Cidade" />
          <Input name="estado" defaultValue={loja.estado ?? ""} placeholder="Estado" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="horario_atendimento" defaultValue={loja.horario_atendimento ?? ""} placeholder="Horário de atendimento" />
          <Select name="tipo_atendimento" defaultValue={loja.tipo_atendimento ?? ""}>
            <option value="">Tipo de atendimento</option>
            <option value="Apenas online">Apenas online</option>
            <option value="Retirada no local">Retirada no local</option>
            <option value="Entrega local">Entrega local</option>
            <option value="Envio para todo o Brasil">Envio para todo o Brasil</option>
            <option value="Loja física">Loja física</option>
            <option value="Atendimento com hora marcada">Atendimento com hora marcada</option>
          </Select>
        </div>
        <Input name="link_maps" defaultValue={loja.link_maps ?? ""} placeholder="Link do Google Maps" className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="formas_entrega" defaultValue={loja.formas_entrega ?? ""} placeholder="Formas de entrega" />
          <Input name="formas_pagamento" defaultValue={loja.formas_pagamento ?? ""} placeholder="Formas de pagamento" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="prazo_envio" defaultValue={loja.prazo_envio ?? ""} placeholder="Prazo de envio ou retirada" />
          <Input name="politica_troca" defaultValue={loja.politica_troca ?? ""} placeholder="Política de troca" />
        </div>
      </Card>

      <Card className="p-5 lg:p-6">
        <SectionTitle icon={ImageIcon} title="Aparência" description="Cores usadas em detalhes do catálogo." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input name="cor_principal" type="color" defaultValue={loja.cor_principal} />
          <Input name="cor_secundaria" type="color" defaultValue={loja.cor_secundaria} />
          <Input name="cor_fundo" type="color" defaultValue={loja.cor_fundo ?? "#FAF6EF"} />
          <Input name="cor_botoes" type="color" defaultValue={loja.cor_botoes ?? "#D4AF37"} />
          <Input name="cor_texto" type="color" defaultValue={loja.cor_texto ?? "#1E1D1B"} />
        </div>
        <div className="mt-4 rounded-2xl border border-[#E7D8C5] bg-bege p-4">
          <p className="text-sm font-semibold text-preto">Preview da paleta</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["#D4AF37", "#F8DDEB", "#FAF6EF", "#1E1D1B", "#FFFFFF"].map((color) => (
              <span key={color} className="h-10 w-16 rounded-full border border-black/5" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {["Dica de imagem: use fotos claras, nítidas e sem texto por cima.", "Como escolher uma boa capa: deixe o produto ou modelo mais para o centro/direita.", "Antes de divulgar, cadastre pelo menos 6 produtos com fotos reais."].map((tip) => (
          <div key={tip} className="rounded-[22px] border border-dourado/15 bg-bege/80 p-4 text-sm leading-6 text-texto">
            {tip}
          </div>
        ))}
      </div>

      {message ? <p className="rounded-2xl bg-rosa-bebe px-4 py-3 text-sm text-preto">{message}</p> : null}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button disabled={loading} className="shadow-[0_16px_35px_rgba(168,121,33,0.25)]">{loading ? "Salvando..." : "Salvar alterações"}</Button>
      </div>
    </form>
  );
}

function SectionTitle({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-dourado/15 text-dourado">
        <Icon size={20} />
      </span>
      <div>
        <h2 className="font-serif text-3xl leading-none text-preto">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-texto">{description}</p>
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon, external }: { href: string; label: string; icon: LucideIcon; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-dourado/25 bg-white px-4 text-sm font-semibold text-preto transition hover:border-dourado">
      <Icon size={16} />
      {label}
    </Link>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import { uploadImage } from "@/lib/utils/uploadImage";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";
import type { Loja } from "@/types/loja";

type StoreProfileFormProps = {
  loja: Loja;
};

export function StoreProfileForm({ loja }: StoreProfileFormProps) {
  const [logo, setLogo] = useState<File[]>([]);
  const [capa, setCapa] = useState<File[]>([]);
  const [donaFoto, setDonaFoto] = useState<File[]>([]);
  const [ativa, setAtiva] = useState(loja.ativa);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    const slug = slugify(String(form.get("slug") ?? nome));
    const whatsapp = normalizeWhatsapp(String(form.get("whatsapp") ?? ""));

    if (!nome || !slug || !whatsapp) {
      setMessage("Nome da loja, slug e WhatsApp sao obrigatorios.");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();

    try {
      const logo_url = logo[0] ? await uploadImage(supabase, "lojas", `${loja.id}/logo`, logo[0]) : loja.logo_url;
      const capa_url = capa[0] ? await uploadImage(supabase, "lojas", `${loja.id}/capa`, capa[0]) : loja.capa_url;
      const dona_foto_url = donaFoto[0] ? await uploadImage(supabase, "lojas", `${loja.id}/dona`, donaFoto[0]) : loja.dona_foto_url;
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
          cor_principal: String(form.get("cor_principal") ?? "#F8DDEB"),
          cor_secundaria: String(form.get("cor_secundaria") ?? "#D4AF37"),
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
          tipo_atendimento: String(form.get("tipo_atendimento") ?? "") || null
        })
        .eq("id", loja.id)
        .eq("user_id", loja.user_id);

      if (error) throw error;
      setMessage("Perfil da loja atualizado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel concluir esta acao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Dados da loja</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="nome" defaultValue={loja.nome} placeholder="Nome da loja" required />
          <Input name="slug" defaultValue={loja.slug} placeholder="slug-da-loja" required />
        </div>
        <Textarea name="descricao" defaultValue={loja.descricao ?? ""} placeholder="Descricao curta da loja" className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="whatsapp" defaultValue={loja.whatsapp ?? ""} placeholder="WhatsApp com DDD" required />
          <Input name="instagram" defaultValue={loja.instagram ?? ""} placeholder="Instagram" />
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Imagens</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload label="Logo" currentUrl={loja.logo_url} onFilesChange={setLogo} />
          <ImageUpload label="Capa" currentUrl={loja.capa_url} onFilesChange={setCapa} />
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Sobre a loja</h2>
        <Textarea name="sobre_loja" defaultValue={loja.sobre_loja ?? ""} placeholder="Texto sobre a loja" />
        <Textarea name="estilo_loja" defaultValue={loja.estilo_loja ?? ""} placeholder="Estilo da loja" className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input name="diferencial_1" defaultValue={loja.diferencial_1 ?? ""} placeholder="Diferencial 1" />
          <Input name="diferencial_2" defaultValue={loja.diferencial_2 ?? ""} placeholder="Diferencial 2" />
          <Input name="diferencial_3" defaultValue={loja.diferencial_3 ?? ""} placeholder="Diferencial 3" />
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Sobre a dona</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="dona_nome" defaultValue={loja.dona_nome ?? ""} placeholder="Nome da dona" />
          <Input name="dona_instagram" defaultValue={loja.dona_instagram ?? ""} placeholder="Instagram da dona" />
        </div>
        <Textarea name="dona_historia" defaultValue={loja.dona_historia ?? ""} placeholder="Historia da dona" className="mt-4" />
        <div className="mt-4">
          <ImageUpload label="Foto da dona" currentUrl={loja.dona_foto_url} onFilesChange={setDonaFoto} />
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Localizacao e atendimento</h2>
        <Input name="endereco" defaultValue={loja.endereco ?? ""} placeholder="Endereco" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="cidade" defaultValue={loja.cidade ?? ""} placeholder="Cidade" />
          <Input name="estado" defaultValue={loja.estado ?? ""} placeholder="Estado" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="horario_atendimento" defaultValue={loja.horario_atendimento ?? ""} placeholder="Horario de atendimento" />
          <Input name="tipo_atendimento" defaultValue={loja.tipo_atendimento ?? ""} placeholder="Tipo de atendimento" />
        </div>
        <Input name="link_maps" defaultValue={loja.link_maps ?? ""} placeholder="Link do Google Maps" className="mt-4" />
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-serif text-3xl text-preto">Aparencia e status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="cor_principal" type="color" defaultValue={loja.cor_principal} />
          <Input name="cor_secundaria" type="color" defaultValue={loja.cor_secundaria} />
        </div>
        <div className="mt-5">
          <Switch checked={ativa} onCheckedChange={setAtiva} label={ativa ? "Loja ativa" : "Loja inativa"} />
        </div>
      </Card>
      {message ? <p className="rounded-2xl bg-rosa-bebe px-4 py-3 text-sm text-preto">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Salvando..." : "Salvar alteracoes"}</Button>
    </form>
  );
}

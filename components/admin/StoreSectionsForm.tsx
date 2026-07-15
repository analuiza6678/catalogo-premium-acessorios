"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import type { Loja } from "@/types/loja";
import type { StoreSection, StoreSectionContent } from "@/types/store-section";
import { defaultSectionContent, resolveStoreSections } from "@/types/store-section";

const sectionLabels: Record<StoreSection["type"], string> = {
  hero: "Capa principal",
  products: "Produtos",
  benefits: "Benefícios",
  how_to_buy: "Como comprar",
  about: "Sobre a loja",
  owner: "Fundadora",
  testimonials: "Depoimentos",
  faq: "Perguntas frequentes",
  location: "Localização e atendimento",
  final_cta: "Chamada final",
  footer: "Rodapé",
  custom_banner: "Banner personalizado"
};

function editableContent(section: StoreSection): StoreSectionContent {
  return section.draft_content ?? section.content ?? defaultSectionContent[section.type] ?? {};
}

export function StoreSectionsForm({ loja, sections: initialSections }: { loja: Loja; sections?: StoreSection[] }) {
  const [sections, setSections] = useState<StoreSection[]>(resolveStoreSections(loja.id, initialSections));
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const sorted = useMemo(() => [...sections].sort((a, b) => a.position - b.position), [sections]);

  function replaceOrdered(next: StoreSection[]) {
    setSections(next.map((section, position) => ({ ...section, position })));
  }

  function patchSection(index: number, patch: Partial<StoreSection>) {
    const next = [...sorted];
    next[index] = { ...next[index], ...patch };
    replaceOrdered(next);
  }

  function updateContent(index: number, key: keyof StoreSectionContent, value: string) {
    const current = sorted[index];
    patchSection(index, { draft_content: { ...editableContent(current), [key]: value } });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    replaceOrdered(next);
  }

  async function save(mode: "draft" | "publish", event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSaving(mode);
    const supabase = createClient();
    const payload = sorted.map((section) => {
      const draft = editableContent(section);
      return {
        loja_id: loja.id,
        type: section.type,
        enabled: section.enabled,
        position: section.position,
        content: mode === "publish" ? draft : section.content,
        styles: section.styles ?? {},
        draft_content: mode === "publish" ? null : draft,
        draft_styles: section.draft_styles ?? null,
        updated_at: new Date().toISOString()
      };
    });

    const { error } = await supabase.from("store_sections").upsert(payload, { onConflict: "loja_id,type" });
    if (!error && mode === "publish") {
      await supabase.from("store_revisions").insert({
        loja_id: loja.id,
        snapshot: { sections: payload },
        status: "published",
        published_at: new Date().toISOString()
      });
    }
    setSaving(null);

    if (error) {
      toast.error(error.message.includes("store_sections") ? "Rode a migration 0006 no Supabase antes de editar a vitrine." : error.message);
      return;
    }

    if (mode === "publish") {
      setSections((current) => current.map((section) => ({ ...section, content: editableContent(section), draft_content: null })));
    }

    toast.success(mode === "publish" ? "Vitrine publicada com sucesso." : "Rascunho salvo com sucesso.");
  }

  return (
    <form onSubmit={(event) => save("draft", event)} className="space-y-4">
      <div className="rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Editor da vitrine</p>
            <h2 className="mt-2 font-serif text-3xl text-[#1E1D1B]">Seções publicáveis</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6258]">Reordene, oculte e edite os principais textos. O rascunho não muda a página pública até você publicar.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`/${loja.slug}/shop`} target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C9A24D]/20 bg-white px-5 py-2.5 text-sm font-bold text-[#1E1D1B]">Visualizar</a>
            <Button type="submit" disabled={saving !== null}>{saving === "draft" ? "Salvando..." : "Salvar rascunho"}</Button>
            <Button type="button" disabled={saving !== null} onClick={() => save("publish")}>{saving === "publish" ? "Publicando..." : "Publicar"}</Button>
          </div>
        </div>
      </div>

      {sorted.map((section, index) => {
        const content = editableContent(section);
        return (
          <section key={section.type} className="rounded-[26px] border border-[#C9A24D]/16 bg-white/72 p-5 shadow-[0_14px_40px_rgba(80,55,25,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F7EFE3] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#A87921]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-3xl text-[#1E1D1B]">{sectionLabels[section.type] ?? section.type}</h3>
                </div>
                <p className="mt-2 text-sm text-[#6F6258]">{section.enabled ? "Ativa no catálogo público" : "Oculta no catálogo público"}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => move(index, -1)} className="grid size-10 place-items-center rounded-full border border-[#C9A24D]/20 bg-white" aria-label="Subir seção"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => move(index, 1)} className="grid size-10 place-items-center rounded-full border border-[#C9A24D]/20 bg-white" aria-label="Descer seção"><ArrowDown size={16} /></button>
                <button type="button" onClick={() => patchSection(index, { enabled: !section.enabled })} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#C9A24D]/20 bg-white px-4 text-sm font-bold">
                  {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  {section.enabled ? "Ocultar" : "Exibir"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <label>
                <span className="text-sm font-bold text-[#1E1D1B]">Texto pequeno</span>
                <Input value={content.eyebrow ?? ""} onChange={(event) => updateContent(index, "eyebrow", event.target.value)} className="mt-2" />
              </label>
              <label>
                <span className="text-sm font-bold text-[#1E1D1B]">Título</span>
                <Input value={content.title ?? ""} onChange={(event) => updateContent(index, "title", event.target.value)} className="mt-2" />
              </label>
              <label className="lg:col-span-2">
                <span className="text-sm font-bold text-[#1E1D1B]">Descrição / subtítulo</span>
                <Textarea value={content.subtitle ?? content.description ?? ""} onChange={(event) => updateContent(index, section.type === "hero" ? "subtitle" : "description", event.target.value)} className="mt-2" />
              </label>
              <label>
                <span className="text-sm font-bold text-[#1E1D1B]">Botão principal</span>
                <Input value={content.primaryButtonText ?? ""} onChange={(event) => updateContent(index, "primaryButtonText", event.target.value)} className="mt-2" />
              </label>
              <label>
                <span className="text-sm font-bold text-[#1E1D1B]">Botão WhatsApp</span>
                <Input value={content.whatsappButtonText ?? ""} onChange={(event) => updateContent(index, "whatsappButtonText", event.target.value)} className="mt-2" />
              </label>
            </div>
          </section>
        );
      })}
    </form>
  );
}

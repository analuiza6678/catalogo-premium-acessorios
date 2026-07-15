"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import type { Loja } from "@/types/loja";
import type { StoreTheme } from "@/types/store-theme";
import { readyThemes, resolveStoreTheme, storeThemeToCssVars } from "@/types/store-theme";

const colorFields = [
  ["primary_color", "Cor principal", "Detalhes, links ativos e ícones."],
  ["secondary_color", "Cor secundária", "Fundos suaves e detalhes delicados."],
  ["background_color", "Fundo da loja", "Base principal do catálogo público."],
  ["surface_color", "Fundo dos cards", "Cards, filtros e blocos internos."],
  ["text_color", "Texto principal", "Títulos e informações importantes."],
  ["muted_text_color", "Texto secundário", "Descrições e textos auxiliares."],
  ["button_color", "Botões principais", "Compra, WhatsApp e ações principais."],
  ["button_text_color", "Texto dos botões", "Texto dentro dos botões principais."],
  ["promotion_color", "Promoções e preço", "Preços, promoções e destaques."]
] as const;

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return null;
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function contrastRatio(a: string, b: string) {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  if (!rgbA || !rgbB) return 21;
  const luminance = ({ r, g, b: blue }: { r: number; g: number; b: number }) => {
    const parts = [r, g, blue].map((value) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
  };
  const l1 = luminance(rgbA);
  const l2 = luminance(rgbB);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function ThemeAppearanceForm({ loja, theme }: { loja: Loja; theme?: StoreTheme | null }) {
  const [form, setForm] = useState<StoreTheme>(resolveStoreTheme(loja, theme));
  const [saving, setSaving] = useState(false);
  const vars = useMemo(() => storeThemeToCssVars(form), [form]);
  const poorContrast = contrastRatio(form.text_color, form.background_color) < 4.5 || contrastRatio(form.button_text_color, form.button_color) < 4.5;

  function update<K extends keyof StoreTheme>(key: K, value: StoreTheme[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (poorContrast) {
      toast.error("A combinação de cores está com contraste baixo. Ajuste antes de salvar.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("store_theme").upsert({ ...form, loja_id: loja.id, updated_at: new Date().toISOString() }, { onConflict: "loja_id" });
    setSaving(false);

    if (error) {
      toast.error(error.message.includes("store_theme") ? "Rode a migration 0006 no Supabase antes de salvar a aparência." : error.message);
      return;
    }

    toast.success("Aparência atualizada com sucesso.");
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Temas prontos</p>
            <h2 className="mt-2 font-serif text-3xl text-[#1E1D1B]">Escolha uma base visual</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6258]">Aplique um tema e ajuste cada cor manualmente. A vitrine pública usa essas cores automaticamente.</p>
          </div>
          <select
            className="min-h-12 rounded-2xl border border-[#E7D8C5] bg-white px-4 text-sm"
            defaultValue=""
            onChange={(event) => {
              const key = event.target.value as keyof typeof readyThemes;
              if (key) setForm((current) => ({ ...current, ...readyThemes[key] }));
            }}
          >
            <option value="">Selecionar tema</option>
            {Object.entries(readyThemes).map(([key, preset]) => (
              <option key={key} value={key}>{preset.label}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)]">
          <h2 className="font-serif text-3xl text-[#1E1D1B]">Cores avançadas</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {colorFields.map(([key, label, help]) => (
              <label key={key} className="rounded-2xl border border-[#E7D8C5] bg-[#FFFDF9] p-4">
                <span className="text-sm font-bold text-[#1E1D1B]">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#6F6258]">{help}</span>
                <div className="mt-3 flex gap-2">
                  <input type="color" value={String(form[key])} onChange={(event) => update(key, event.target.value as StoreTheme[typeof key])} className="h-12 w-14 rounded-xl border border-[#E7D8C5] bg-white p-1" />
                  <Input value={String(form[key])} onChange={(event) => update(key, event.target.value as StoreTheme[typeof key])} />
                </div>
              </label>
            ))}
          </div>
          {poorContrast ? <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Atenção: algumas cores estão com contraste baixo e podem dificultar a leitura.</p> : null}
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)]">
            <h2 className="font-serif text-3xl text-[#1E1D1B]">Tipografia e estilo</h2>
            <label className="mt-4 block">
              <span className="text-sm font-bold">Fonte dos títulos</span>
              <select value={form.heading_font} onChange={(event) => update("heading_font", event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 text-sm">
                <option>Cormorant Garamond</option>
                <option>Playfair Display</option>
                <option>DM Serif Display</option>
                <option>Bodoni Moda</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-bold">Estilo dos botões</span>
              <select value={form.button_style} onChange={(event) => update("button_style", event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-[#E7D8C5] bg-white px-4 text-sm">
                <option value="pill">Cápsula</option>
                <option value="rounded">Arredondado</option>
                <option value="square">Reto</option>
                <option value="outline">Contorno</option>
                <option value="shadow">Com sombra</option>
                <option value="flat">Sem sombra</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-bold">Arredondamento dos cards</span>
              <Input type="number" min={8} max={40} value={form.border_radius} onChange={(event) => update("border_radius", Number(event.target.value))} className="mt-2" />
            </label>
          </div>

          <div className="rounded-[28px] border border-[#C9A24D]/18 bg-white/72 p-5 shadow-[0_18px_50px_rgba(80,55,25,0.07)]">
            <h2 className="font-serif text-3xl text-[#1E1D1B]">Prévia ao vivo</h2>
            <div style={vars} className="mt-4 rounded-[var(--store-radius)] border border-[var(--store-border)] bg-[var(--store-background)] p-5 text-[var(--store-text)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--store-primary)]">Catálogo premium</p>
              <h3 className="mt-2 font-serif text-4xl leading-none">Minha coleção</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--store-muted)]">Veja como títulos, textos, cards e botões ficam com a paleta escolhida.</p>
              <button type="button" className="mt-5 rounded-full bg-[var(--store-button)] px-5 py-3 text-sm font-bold text-[var(--store-button-text)]">Botão principal</button>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar aparência"}</Button>
      </div>
    </form>
  );
}

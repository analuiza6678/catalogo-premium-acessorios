import type { CSSProperties } from "react";
import type { Loja } from "./loja";

export type StoreTheme = {
  id?: string;
  loja_id: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  muted_text_color: string;
  button_color: string;
  button_text_color: string;
  border_color: string;
  promotion_color: string;
  warning_color: string;
  success_color: string;
  heading_font: string;
  body_font: string;
  button_style: "pill" | "rounded" | "square" | "outline" | "shadow" | "flat" | string;
  card_style: "boutique" | "minimal" | "compact" | "vertical-image" | "square-image" | string;
  border_radius: number;
  shadow_style: "soft" | "medium" | "none" | string;
  updated_at?: string;
};

export type StoreThemeVars = CSSProperties & Record<`--store-${string}`, string>;

export const defaultStoreTheme: StoreTheme = {
  loja_id: "",
  primary_color: "#C9A24D",
  secondary_color: "#F8DDEB",
  background_color: "#FAF6EF",
  surface_color: "#FFFFFF",
  text_color: "#1E1D1B",
  muted_text_color: "#6F6258",
  button_color: "#C9A24D",
  button_text_color: "#FFFFFF",
  border_color: "rgba(201,162,77,0.24)",
  promotion_color: "#A87921",
  warning_color: "#B45309",
  success_color: "#15803D",
  heading_font: "Cormorant Garamond",
  body_font: "Inter",
  button_style: "rounded",
  card_style: "boutique",
  border_radius: 24,
  shadow_style: "soft"
};

export const readyThemes = {
  delicado: {
    label: "Delicado",
    primary_color: "#C9A24D",
    secondary_color: "#F8DDEB",
    background_color: "#FAF6EF",
    surface_color: "#FFFFFF",
    text_color: "#1E1D1B",
    muted_text_color: "#6F6258",
    button_color: "#C9A24D"
  },
  luxo: {
    label: "Luxo",
    primary_color: "#B88A2A",
    secondary_color: "#EADBC8",
    background_color: "#F6EFE5",
    surface_color: "#FFFDF9",
    text_color: "#211A16",
    muted_text_color: "#675B52",
    button_color: "#A87921"
  },
  minimalista: {
    label: "Minimalista",
    primary_color: "#1E1D1B",
    secondary_color: "#EADBC8",
    background_color: "#FAF8F4",
    surface_color: "#FFFFFF",
    text_color: "#1E1D1B",
    muted_text_color: "#6F6258",
    button_color: "#1E1D1B"
  },
  romantico: {
    label: "Romântico",
    primary_color: "#B8849A",
    secondary_color: "#F8DDEB",
    background_color: "#FFF7F9",
    surface_color: "#FFFFFF",
    text_color: "#241E20",
    muted_text_color: "#735F66",
    button_color: "#B8849A"
  },
  classico: {
    label: "Clássico",
    primary_color: "#A87921",
    secondary_color: "#EADBC8",
    background_color: "#F8F1E7",
    surface_color: "#FFFDF9",
    text_color: "#241B17",
    muted_text_color: "#6F6258",
    button_color: "#A87921"
  },
  moderno: {
    label: "Moderno",
    primary_color: "#26211E",
    secondary_color: "#D7AE4A",
    background_color: "#F4EFE8",
    surface_color: "#FFFFFF",
    text_color: "#1E1D1B",
    muted_text_color: "#61564E",
    button_color: "#26211E"
  }
} as const;

export function resolveStoreTheme(loja: Loja, theme?: Partial<StoreTheme> | null): StoreTheme {
  return {
    ...defaultStoreTheme,
    loja_id: loja.id,
    primary_color: loja.cor_principal || theme?.primary_color || defaultStoreTheme.primary_color,
    secondary_color: loja.cor_secundaria || theme?.secondary_color || defaultStoreTheme.secondary_color,
    background_color: loja.cor_fundo || theme?.background_color || defaultStoreTheme.background_color,
    text_color: loja.cor_texto || theme?.text_color || defaultStoreTheme.text_color,
    button_color: loja.cor_botoes || theme?.button_color || loja.cor_principal || defaultStoreTheme.button_color,
    ...theme
  };
}

export function storeThemeToCssVars(theme: StoreTheme): StoreThemeVars {
  return {
    "--store-primary": theme.primary_color,
    "--store-secondary": theme.secondary_color,
    "--store-background": theme.background_color,
    "--store-surface": theme.surface_color,
    "--store-text": theme.text_color,
    "--store-muted": theme.muted_text_color,
    "--store-button": theme.button_color,
    "--store-button-text": theme.button_text_color,
    "--store-border": theme.border_color,
    "--store-promotion": theme.promotion_color,
    "--store-warning": theme.warning_color,
    "--store-success": theme.success_color,
    "--store-radius": `${theme.border_radius}px`,
    "--store-heading-font": theme.heading_font,
    "--store-body-font": theme.body_font
  };
}


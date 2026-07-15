export type StoreSectionType =
  | "hero"
  | "products"
  | "benefits"
  | "how_to_buy"
  | "about"
  | "owner"
  | "testimonials"
  | "faq"
  | "location"
  | "final_cta"
  | "footer"
  | "custom_banner";

export type EditableItem = {
  title: string;
  text?: string;
  icon?: string;
  href?: string;
  enabled?: boolean;
};

export type StoreSectionContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  whatsappButtonText?: string;
  emptyTitle?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  badgeText?: string;
  brandPhrase?: string;
  items?: EditableItem[];
  links?: EditableItem[];
};

export type StoreSection = {
  id?: string;
  loja_id: string;
  type: StoreSectionType;
  enabled: boolean;
  position: number;
  content: StoreSectionContent;
  styles?: Record<string, unknown>;
  draft_content?: StoreSectionContent | null;
  draft_styles?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

export const defaultSectionOrder: StoreSectionType[] = [
  "hero",
  "products",
  "benefits",
  "how_to_buy",
  "about",
  "owner",
  "location",
  "final_cta",
  "footer"
];

export const defaultSectionContent: Record<StoreSectionType, StoreSectionContent> = {
  hero: {
    eyebrow: "Catálogo premium",
    title: "Acessórios delicados para iluminar seu estilo",
    subtitle: "Peças selecionadas para o dia a dia, presentes e composições especiais.",
    primaryButtonText: "Ver acessórios",
    whatsappButtonText: "Comprar pelo WhatsApp",
    items: [
      { title: "Pronta entrega" },
      { title: "Atendimento pelo WhatsApp" },
      { title: "Embalagem para presente" },
      { title: "Peças selecionadas" }
    ]
  },
  products: {
    title: "Escolha suas peças favoritas",
    description: "Monte seu pedido, adicione à sacola e finalize pelo WhatsApp com atendimento personalizado.",
    searchPlaceholder: "Buscar por nome ou palavra-chave",
    emptyTitle: "Novas peças em breve",
    emptyText: "Estamos preparando uma seleção especial de acessórios. Fale pelo WhatsApp para acompanhar os lançamentos."
  },
  benefits: {
    eyebrow: "Experiência boutique",
    title: "Uma experiência pensada nos detalhes",
    description: "Curadoria, atendimento e pedido pelo WhatsApp em uma experiência simples.",
    items: [
      { title: "Curadoria delicada", text: "Peças escolhidas pelo acabamento, brilho e versatilidade.", icon: "Sparkles" },
      { title: "Compra pelo WhatsApp", text: "Envie sua sacola pronta e combine tudo diretamente com a loja.", icon: "MessageCircle" },
      { title: "Kits para presente", text: "Composições prontas para surpreender com delicadeza.", icon: "Gift" },
      { title: "Atendimento próximo", text: "Uma experiência simples, cuidadosa e personalizada.", icon: "HandHeart" }
    ]
  },
  how_to_buy: {
    eyebrow: "Como comprar",
    title: "Comprar é simples",
    description: "Escolha, adicione à sacola e finalize pelo WhatsApp.",
    items: [
      { title: "Escolha as peças" },
      { title: "Adicione ao pedido" },
      { title: "Finalize no WhatsApp" },
      { title: "Combine entrega" }
    ]
  },
  about: {
    eyebrow: "Sobre a loja",
    title: "Minha Loja",
    description: "Uma boutique de acessórios criada para transformar pequenos detalhes em presença."
  },
  owner: {
    eyebrow: "Por trás da loja",
    title: "Quem cuida de cada detalhe",
    brandPhrase: "Com carinho, curadoria e atenção aos detalhes."
  },
  testimonials: { title: "Depoimentos", description: "Opiniões de clientes aparecerão aqui." },
  faq: { title: "Perguntas frequentes", description: "Dúvidas importantes para comprar com tranquilidade." },
  location: {
    eyebrow: "Localização e atendimento",
    title: "Compre com tranquilidade",
    description: "Finalize seu pedido pelo WhatsApp com atendimento próximo, cuidadoso e personalizado."
  },
  final_cta: {
    eyebrow: "Pedido simples",
    title: "Gostou de alguma peça?",
    description: "Monte seu pedido na sacola ou fale diretamente com a loja pelo WhatsApp.",
    primaryButtonText: "Ver sacola",
    whatsappButtonText: "Falar no WhatsApp"
  },
  footer: {
    brandPhrase: "Detalhes delicados para iluminar o seu estilo.",
    description: "Acessórios femininos delicados e sofisticados."
  },
  custom_banner: { title: "Nova campanha", description: "Use esta área para destacar uma coleção ou promoção." }
};

export function resolveStoreSections(lojaId: string, sections?: StoreSection[] | null) {
  const sectionMap = new Map<StoreSectionType, StoreSection>();

  defaultSectionOrder.forEach((type, index) => {
    sectionMap.set(type, {
      loja_id: lojaId,
      type,
      enabled: true,
      position: index,
      content: defaultSectionContent[type],
      styles: {}
    });
  });

  (sections ?? []).forEach((section) => {
    const defaults = defaultSectionContent[section.type] ?? {};
    sectionMap.set(section.type, {
      ...section,
      content: { ...defaults, ...(section.content ?? {}) },
      styles: section.styles ?? {}
    });
  });

  return Array.from(sectionMap.values()).sort((a, b) => a.position - b.position);
}

export function getSection(sections: StoreSection[], type: StoreSectionType) {
  return sections.find((section) => section.type === type);
}


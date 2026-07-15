import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import type { Loja } from "@/types/loja";
import type { StoreSectionContent } from "@/types/store-section";
import { defaultSectionContent } from "@/types/store-section";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { cleanText } from "@/lib/catalog/productDisplay";

export function PremiumFooter({ loja, content }: { loja: Loja; content?: StoreSectionContent }) {
  const section = { ...defaultSectionContent.footer, ...content };
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Vim pelo catálogo da ${loja.nome}.`);
  const instagramUrl = loja.instagram ? (loja.instagram.startsWith("http") ? loja.instagram : `https://instagram.com/${loja.instagram.replace("@", "")}`) : null;
  const payment = cleanText(loja.formas_pagamento);
  const exchange = cleanText(loja.politica_troca);
  const quickLinks = section.links?.filter((link) => link.enabled !== false && link.title && link.href) ?? [
    { title: "Produtos", href: "#produtos" },
    { title: "Kits", href: "#kits" },
    { title: "Sobre", href: "#sobre" },
    { title: "Localização", href: "#localizacao" }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--store-border)] bg-[linear-gradient(135deg,var(--store-background)_0%,color-mix(in_srgb,var(--store-background)_80%,var(--store-secondary))_55%,color-mix(in_srgb,var(--store-background)_70%,var(--store-primary))_100%)] px-[22px] py-14 lg:px-[clamp(40px,7vw,120px)] lg:pb-7 lg:pt-[72px]">
      <div className="pointer-events-none absolute left-[-160px] top-0 h-[420px] w-[620px] rounded-full bg-white/20" />
      <div className="pointer-events-none absolute right-[-120px] bottom-[-140px] h-[360px] w-[360px] rounded-full bg-[var(--store-primary)]/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-9 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:gap-x-12">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-[var(--store-primary)]/70 font-serif text-2xl text-[var(--store-primary)]">{loja.nome?.charAt(0) || "M"}</span>
              <h2 className="font-serif text-[clamp(34px,3vw,46px)] font-medium leading-none text-[var(--store-text)]">{loja.nome}</h2>
            </div>
            <p className="max-w-[300px] text-[15px] leading-[1.7] text-[var(--store-muted)]">{loja.descricao || section.description}</p>
            <span className="mt-6 block h-px w-24 bg-[var(--store-primary)]/55" />
            <p className="mt-5 max-w-[340px] font-serif text-[28px] font-medium leading-[1.15] text-[var(--store-text)]">{section.brandPhrase}</p>
          </div>

          <FooterColumn title="Links rápidos" links={quickLinks.map((link) => ({ label: link.title, href: link.href || "#" }))} />

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--store-primary)]">Contato</h3>
            <div className="flex flex-col gap-3 text-[15px] text-[var(--store-text)]">
              {whatsappUrl ? (
                <Link href={whatsappUrl} target="_blank" className="inline-flex items-center gap-2 transition hover:translate-x-0.5 hover:text-[var(--store-primary)]">
                  <MessageCircle size={16} /> WhatsApp
                </Link>
              ) : null}
              {instagramUrl ? (
                <Link href={instagramUrl} target="_blank" className="inline-flex items-center gap-2 transition hover:translate-x-0.5 hover:text-[var(--store-primary)]">
                  <Instagram size={16} /> Instagram
                </Link>
              ) : null}
              <span>Atendimento online</span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--store-primary)]">Atendimento</h3>
            <div className="flex flex-col gap-3 text-[15px] leading-7 text-[var(--store-text)]">
              <span>{loja.horario_atendimento || "Segunda a sexta, 9h às 18h"}</span>
              <span>Pedidos finalizados pelo WhatsApp</span>
              <span>Sem checkout online</span>
              {payment ? <span>Pagamento: {payment}</span> : null}
              {exchange ? <span>Trocas: {exchange}</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--store-border)] pt-5 text-sm text-[var(--store-muted)]">
          <p>© {year} {loja.nome}. Todos os direitos reservados.</p>
          <p>Feito com cuidado para uma experiência boutique.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--store-primary)]">{title}</h3>
      <nav className="flex flex-col gap-3 text-[15px] text-[var(--store-text)]">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:translate-x-0.5 hover:text-[var(--store-primary)]">
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

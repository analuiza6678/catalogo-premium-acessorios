"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#produtos", label: "Acessórios", active: true },
  { href: "#kits", label: "Kits", kitOnly: true },
  { href: "#sobre", label: "Sobre" },
  { href: "#localizacao", label: "Atendimento" }
];

export function PremiumHeader({ loja, showKits = true }: { loja: Loja; showKits?: boolean }) {
  const [open, setOpen] = useState(false);
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Vim pelo catálogo da ${loja.nome}.`);
  const visibleLinks = links.filter((link) => !link.kitOnly || showKits);

  return (
    <header className="sticky top-0 z-40 bg-[var(--store-background)]/58">
      <div className="flex h-14 w-full items-center justify-between gap-3 px-4 sm:h-16 sm:px-5 lg:h-[78px] lg:gap-6 lg:px-[clamp(28px,5vw,96px)]">
        <Link href={`/${loja.slug}/shop`} className="flex min-w-0 items-center gap-2.5 lg:gap-4">
          <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--store-primary)]/75 bg-[var(--store-background)]/72 text-[var(--store-primary)] shadow-[0_8px_18px_rgba(201,162,77,0.08)] sm:size-10 lg:size-[56px] lg:shadow-[0_12px_32px_rgba(201,162,77,0.10)]">
            {loja.logo_url ? (
              <Image src={loja.logo_url} alt={loja.nome} fill quality={100} sizes="56px" className="object-cover" />
            ) : (
              <span className="font-serif text-[18px] leading-none sm:text-[20px] lg:text-[28px]">{loja.nome?.charAt(0) || "M"}</span>
            )}
          </span>
          <span className="truncate font-serif text-[21px] font-normal leading-none text-[var(--store-primary)] sm:text-[24px] lg:text-[32px]">{loja.nome}</span>
        </Link>

        <nav className="hidden items-center gap-[clamp(34px,3.2vw,58px)] text-[16px] font-medium text-[var(--store-text)]/88 lg:flex">
          {visibleLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-7 transition hover:text-[var(--store-primary)] ${
                link.active ? "text-[var(--store-primary)] after:absolute after:bottom-[18px] after:left-1/2 after:h-px after:w-12 after:-translate-x-1/2 after:bg-[var(--store-primary)]" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {whatsappUrl ? (
            <Link href={whatsappUrl} target="_blank" className="hidden sm:block">
              <Button
                variant="ghost"
                className="h-[48px] rounded-full border-[var(--store-border)] bg-white/82 px-7 text-[15px] font-semibold text-[var(--store-text)] shadow-[0_12px_30px_rgba(58,42,36,0.045)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <MessageCircle size={18} className="text-[var(--store-primary)]" />
                WhatsApp
              </Button>
            </Link>
          ) : null}

          <button
            className="grid size-9 place-items-center rounded-full border border-[var(--store-primary)]/45 bg-white/70 text-[var(--store-text)] sm:size-10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
            type="button"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--store-border)] bg-[var(--store-background)]/98 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${link.active ? "bg-white/70 text-[var(--store-primary)]" : "bg-white/70 text-[var(--store-text)]"}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

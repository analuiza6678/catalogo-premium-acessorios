import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

export function PremiumFooter({ loja }: { loja: Loja }) {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Ola! Vim pelo catalogo da ${loja.nome}.`);
  const instagramUrl = loja.instagram ? (loja.instagram.startsWith("http") ? loja.instagram : `https://instagram.com/${loja.instagram.replace("@", "")}`) : null;

  return (
    <footer className="relative overflow-hidden border-t border-[#C9A24D]/20 bg-[linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_55%,#EFE3D4_100%)] px-[22px] py-14 lg:px-[clamp(40px,7vw,120px)] lg:pb-7 lg:pt-[72px]">
      <div className="pointer-events-none absolute left-[-160px] top-0 h-[420px] w-[620px] rounded-full bg-white/20" />
      <div className="pointer-events-none absolute right-[-120px] bottom-[-140px] h-[360px] w-[360px] rounded-full bg-[#D7AE4A]/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-9 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:gap-x-12">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-[#C9A24D]/70 font-serif text-2xl text-[#B88A2A]">M</span>
              <h2 className="font-serif text-[clamp(34px,3vw,46px)] font-medium leading-none text-[#1E1D1B]">{loja.nome}</h2>
            </div>
            <p className="max-w-[300px] text-[15px] leading-[1.7] text-[#6F6258]">{loja.descricao || "Acessórios femininos delicados e sofisticados."}</p>
            <span className="mt-6 block h-px w-24 bg-[#C9A24D]/55" />
            <p className="mt-5 max-w-[340px] font-serif text-[28px] font-medium leading-[1.15] text-[#2C241F]">
              Detalhes delicados para iluminar o seu estilo.
            </p>
          </div>

          <FooterColumn title="Links rápidos" links={[
            { label: "Produtos", href: "#produtos" },
            { label: "Kits", href: "#kits" },
            { label: "Sobre", href: "#sobre" },
            { label: "Localização", href: "#localizacao" }
          ]} />

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Contato</h3>
            <div className="flex flex-col gap-3 text-[15px] text-[#4E433B]">
              {whatsappUrl ? <Link href={whatsappUrl} target="_blank" className="inline-flex items-center gap-2 transition hover:translate-x-0.5 hover:text-[#A87921]"><MessageCircle size={16} /> WhatsApp</Link> : null}
              {instagramUrl ? <Link href={instagramUrl} target="_blank" className="inline-flex items-center gap-2 transition hover:translate-x-0.5 hover:text-[#A87921]"><Instagram size={16} /> Instagram</Link> : <span>Instagram</span>}
              <span>Atendimento online</span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">Atendimento</h3>
            <div className="flex flex-col gap-3 text-[15px] leading-7 text-[#4E433B]">
              <span>{loja.horario_atendimento || "Segunda a sexta, 9h às 18h"}</span>
              <span>Pedidos finalizados pelo WhatsApp</span>
              <span>Sem checkout online</span>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-[#C9A24D]/14 pt-5 text-sm text-[#7A6E65]">
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
      <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#C9A24D]">{title}</h3>
      <nav className="flex flex-col gap-3 text-[15px] text-[#4E433B]">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:translate-x-0.5 hover:text-[#A87921]">
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

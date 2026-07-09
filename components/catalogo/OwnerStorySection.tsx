import Image from "next/image";
import Link from "next/link";
import { Heart, Instagram, MessageCircle, Sparkles } from "lucide-react";
import type { Loja } from "@/types/loja";
import { cleanText } from "@/lib/catalog/productDisplay";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { AnimatedReveal } from "./AnimatedReveal";

export function OwnerStorySection({ loja }: { loja: Loja }) {
  const ownerName = cleanText(loja.dona_nome);
  const ownerStory = cleanText(loja.dona_historia);
  const ownerPhoto = cleanText(loja.dona_foto_url);
  if (!ownerName && !ownerStory && !ownerPhoto && !loja.dona_instagram) return null;

  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Vim pelo catálogo da ${loja.nome}.`);
  const instagram = loja.dona_instagram || loja.instagram;
  const instagramUrl = instagram ? (instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`) : null;

  return (
    <AnimatedReveal className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(215,174,74,0.08),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(234,219,200,0.42),transparent_30%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_56%,#EFE3D4_100%)] px-[22px] py-20 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute right-[-180px] top-10 h-[520px] w-[520px] rounded-full bg-[#D7AE4A]/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-[clamp(48px,6vw,96px)]">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-[32px] border border-[#C9A24D]/16 bg-white/42 shadow-[0_30px_80px_rgba(80,55,25,0.14)]">
            <div className="relative aspect-[4/5]">
              {ownerPhoto ? (
                <Image src={ownerPhoto} alt={ownerName || "Dona da loja"} fill className="object-cover object-top" />
              ) : (
                <div className="h-full bg-[radial-gradient(circle_at_50%_25%,rgba(215,174,74,0.20),transparent_34%),linear-gradient(135deg,#FAF6EF,#EADBC8)]" />
              )}
            </div>
            <span className="absolute bottom-5 left-5 rounded-full border border-[#C9A24D]/20 bg-white/85 px-4 py-2 text-[13px] font-semibold text-[#6F6258] shadow-[0_12px_28px_rgba(80,55,25,0.08)]">
              Fundadora
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.30em] text-[#C9A24D]">POR TRÁS DA LOJA</p>
          <h2 className="mt-4 max-w-[680px] font-serif text-[clamp(42px,5vw,82px)] font-normal leading-[0.96] tracking-[-0.035em] text-[#1E1D1B]">
            Quem cuida de cada detalhe
          </h2>
          {ownerName ? <h3 className="mt-7 font-serif text-[clamp(34px,3vw,46px)] font-medium leading-[1.05] text-[#1E1D1B]">{ownerName}</h3> : null}
          <p className="mt-4 max-w-[560px] text-[17px] leading-[1.85] text-[#6F6258]">
            {ownerStory || "Cada peça é escolhida com cuidado para transmitir delicadeza, estilo e personalidade."}
          </p>

          <p className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#C9A24D]/18 bg-white/60 px-5 py-4 text-base text-[#4A403A] shadow-[0_12px_30px_rgba(80,55,25,0.06)]">
            <Sparkles size={18} className="text-[#C9A24D]" />
            Com carinho, curadoria e atenção aos detalhes.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {instagramUrl ? (
              <Link href={instagramUrl} target="_blank" className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-[#C9A24D]/24 bg-white/62 px-7 font-semibold text-[#1E1D1B] transition hover:-translate-y-0.5 hover:bg-white">
                <Instagram size={18} className="text-[#C9A24D]" />
                Instagram
              </Link>
            ) : null}
            {whatsappUrl ? (
              <Link href={whatsappUrl} target="_blank" className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-7 font-semibold text-white shadow-[0_18px_40px_rgba(168,121,33,0.22)] transition hover:-translate-y-0.5">
                <MessageCircle size={18} />
                WhatsApp
              </Link>
            ) : null}
          </div>

          <div className="mt-8 grid max-w-[620px] gap-3 sm:grid-cols-3">
            {["Curadoria autoral", "Atendimento próximo", "Escolha pelo WhatsApp"].map((item) => (
              <div key={item} className="rounded-[18px] border border-[#C9A24D]/14 bg-white/55 p-4 text-sm font-semibold text-[#1E1D1B]">
                <Heart className="mb-2 text-[#C9A24D]" size={17} strokeWidth={1.5} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedReveal>
  );
}

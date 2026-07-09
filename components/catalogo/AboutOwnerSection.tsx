import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { AnimatedSection } from "./AnimatedSection";

export function AboutOwnerSection({ loja }: { loja: Loja }) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Olá! Vim pelo catálogo da ${loja.nome}.`);
  const instagram = loja.dona_instagram || loja.instagram;

  return (
    <AnimatedSection className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-dourado">Por tras da loja</p>
        <h2 className="mt-3 font-serif text-4xl text-preto sm:text-5xl">Conheca quem escolhe cada detalhe com carinho.</h2>
        <div className="mx-auto mt-8 rounded-[38px] border border-rosa-bebe bg-bege p-6 shadow-soft sm:p-8">
          <div className="mx-auto mb-5 grid size-28 place-items-center overflow-hidden rounded-full border-4 border-white bg-rosa-bebe shadow-gold">
            {loja.dona_foto_url ? <Image src={loja.dona_foto_url} alt={loja.dona_nome || "Dona da loja"} width={128} height={128} className="size-full object-cover" /> : <span className="font-serif text-5xl text-dourado">{(loja.dona_nome || loja.nome).charAt(0)}</span>}
          </div>
          <h3 className="font-serif text-3xl text-preto">{loja.dona_nome || "Curadoria da loja"}</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-texto">
            {loja.dona_historia || "Cada peca e escolhida com cuidado para transmitir delicadeza, estilo e personalidade."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {instagram ? <Link href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`} target="_blank"><Button variant="ghost"><Instagram size={18} /> Instagram</Button></Link> : null}
            {whatsappUrl ? <Link href={whatsappUrl} target="_blank"><Button><MessageCircle size={18} /> WhatsApp</Button></Link> : null}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

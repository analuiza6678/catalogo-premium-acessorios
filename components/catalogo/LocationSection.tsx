import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { AnimatedSection } from "./AnimatedSection";

export function LocationSection({ loja }: { loja: Loja }) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Ola! Gostaria de saber sobre atendimento e entrega da ${loja.nome}.`);

  return (
    <AnimatedSection id="localizacao" className="bg-bege py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-[40px] border border-rosa-bebe bg-white p-6 shadow-soft sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-dourado">Localizacao e atendimento</p>
              <h2 className="mt-3 font-serif text-4xl text-preto sm:text-5xl">Como comprar com a loja</h2>
              <p className="mt-4 leading-8 text-texto">
                {loja.endereco || loja.cidade ? "Confira as informacoes de atendimento e combine seu pedido diretamente com a loja." : "Atendimento online com pedidos finalizados pelo WhatsApp."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-bege p-5">
                <MapPin className="mb-3 text-dourado" size={24} />
                <p className="font-semibold text-preto">{loja.cidade || "Atendimento online"}{loja.estado ? ` / ${loja.estado}` : ""}</p>
                <p className="mt-2 text-sm leading-6 text-texto">{loja.endereco || "Endereco sob consulta."}</p>
              </div>
              <div className="rounded-[24px] bg-bege p-5">
                <Clock className="mb-3 text-dourado" size={24} />
                <p className="font-semibold text-preto">Horario</p>
                <p className="mt-2 text-sm leading-6 text-texto">{loja.horario_atendimento || "Combine pelo WhatsApp."}</p>
              </div>
              <div className="rounded-[24px] bg-bege p-5">
                <MessageCircle className="mb-3 text-dourado" size={24} />
                <p className="font-semibold text-preto">Atendimento</p>
                <p className="mt-2 text-sm leading-6 text-texto">{loja.tipo_atendimento || "Pedidos pelo WhatsApp."}</p>
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {loja.link_maps ? <Link href={loja.link_maps} target="_blank"><Button variant="ghost"><MapPin size={18} /> Abrir localizacao</Button></Link> : null}
            {whatsappUrl ? <Link href={whatsappUrl} target="_blank"><Button><MessageCircle size={18} /> Chamar no WhatsApp</Button></Link> : null}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

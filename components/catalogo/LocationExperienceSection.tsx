import Link from "next/link";
import { Clock, MapPinned, MessageCircle, PackageCheck } from "lucide-react";
import type { Loja } from "@/types/loja";
import { mockStore } from "@/lib/mock/catalog";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";
import { AnimatedReveal } from "./AnimatedReveal";

export function LocationExperienceSection({ loja }: { loja: Loja }) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Ola! Gostaria de saber sobre atendimento e entrega da ${loja.nome}.`);
  const details = [
    { icon: MessageCircle, title: "Atendimento", text: "Pedidos finalizados pelo WhatsApp." },
    { icon: Clock, title: "Horário", text: loja.horario_atendimento || mockStore.horario_atendimento || "Segunda a sexta, 9h às 18h." },
    { icon: MapPinned, title: "Localização", text: `${loja.cidade || mockStore.cidade || "Atendimento online"}${loja.estado ? ` / ${loja.estado}` : ""}` },
    { icon: PackageCheck, title: "Entrega/Retirada", text: loja.endereco || "Combinada diretamente pelo WhatsApp." }
  ];

  return (
    <AnimatedReveal id="localizacao" className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_18%,rgba(215,174,74,0.08),transparent_30%),radial-gradient(circle_at_90%_50%,rgba(234,219,200,0.42),transparent_34%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_56%,#EFE3D4_100%)] px-[22px] py-20 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute -left-44 top-0 h-[520px] w-[760px] rotate-[-12deg] rounded-[100%] border border-[#C9A24D]/10 bg-white/18" />
      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-9 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.30em] text-[#C9A24D]">LOCALIZAÇÃO E ATENDIMENTO</p>
          <h2 className="mt-4 font-serif text-[clamp(42px,5vw,78px)] font-normal leading-[0.98] tracking-[-0.035em] text-[#1E1D1B]">
            Compre com tranquilidade
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.35fr]">
          <div className="relative overflow-hidden rounded-[30px] border border-[#C9A24D]/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0%,rgba(247,239,227,0.82)_100%)] p-7 shadow-[0_28px_80px_rgba(80,55,25,0.10)] backdrop-blur-xl lg:p-10">
            <span className="absolute -right-20 -top-20 size-56 rounded-full bg-[#D7AE4A]/12" />
            <div className="grid size-14 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320] shadow-[0_14px_30px_rgba(168,121,33,0.18)]">
              <MessageCircle size={28} strokeWidth={1.55} />
            </div>
            <h3 className="mt-7 font-serif text-[36px] font-medium leading-[1.05] text-[#1E1D1B]">Atendimento online</h3>
            <p className="mt-4 max-w-[420px] text-base leading-[1.75] text-[#6F6258]">
              Finalize seu pedido pelo WhatsApp com atendimento próximo, cuidadoso e personalizado.
            </p>
            {whatsappUrl ? (
              <Link href={whatsappUrl} target="_blank" className="mt-7 inline-flex h-14 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] px-7 font-bold text-white shadow-[0_18px_40px_rgba(168,121,33,0.22)] transition hover:-translate-y-1 max-sm:w-full max-sm:justify-center">
                <MessageCircle size={19} />
                Chamar no WhatsApp
              </Link>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <article key={detail.title} className="rounded-[26px] border border-[#C9A24D]/16 bg-white/62 p-6 shadow-[0_20px_55px_rgba(80,55,25,0.07)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#C9A24D]/32 hover:shadow-[0_28px_70px_rgba(80,55,25,0.11)] lg:p-8">
                  <div className="grid size-11 place-items-center rounded-2xl border border-[#C9A24D]/20 bg-[#D7AE4A]/14 text-[#A87921]">
                    <Icon size={23} strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-5 font-serif text-[30px] font-medium leading-[1.08] text-[#1E1D1B]">{detail.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-[#6F6258]">{detail.text}</p>
                </article>
              );
            })}
          </div>
        </div>

        <p className="mt-7 inline-flex rounded-full border border-[#C9A24D]/14 bg-white/48 px-6 py-3 text-[15px] text-[#6F6258]">
          Pedidos simples, atendimento humano e finalização rápida pelo WhatsApp.
        </p>
      </div>
    </AnimatedReveal>
  );
}

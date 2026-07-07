import Image from "next/image";
import { Gem, Gift, HeartHandshake } from "lucide-react";
import type { Loja } from "@/types/loja";
import { fallbackImages, mockStore } from "@/lib/mock/catalog";
import { AnimatedReveal } from "./AnimatedReveal";

export function StoreStorySection({ loja }: { loja: Loja }) {
  const story = loja.sobre_loja || mockStore.sobre_loja!;
  const style = loja.estilo_loja || mockStore.estilo_loja!;
  const values = [
    { icon: Gem, title: loja.diferencial_1 || mockStore.diferencial_1! },
    { icon: Gift, title: loja.diferencial_2 || mockStore.diferencial_2! },
    { icon: HeartHandshake, title: loja.diferencial_3 || mockStore.diferencial_3! }
  ];

  return (
    <AnimatedReveal id="sobre" className="relative overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(215,174,74,0.08),transparent_28%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_52%,#EFE3D4_100%)] px-[22px] py-20 lg:px-[clamp(40px,7vw,120px)] lg:py-24">
      <div className="pointer-events-none absolute -left-44 top-20 h-[560px] w-[760px] rotate-[-10deg] rounded-[100%] border border-[#C9A24D]/10 bg-white/18" />
      <div className="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-[clamp(56px,7vw,110px)]">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-[28px] border border-[#C9A24D]/14 bg-white/42 shadow-[0_28px_80px_rgba(80,55,25,0.12)]">
            <div className="relative aspect-[4/4.6]">
              <Image src={loja.capa_url || fallbackImages[1]} alt={loja.nome} fill className="object-cover" />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.30em] text-[#C9A24D]">SOBRE A LOJA</p>
          <h2 className="mt-4 font-serif text-[clamp(42px,5vw,82px)] font-normal leading-[0.96] tracking-[-0.035em] text-[#1E1D1B]">{loja.nome}</h2>
          <span className="mt-7 block h-px w-28 bg-[#C9A24D]/65" />
          <p className="mt-7 max-w-[560px] text-[17px] leading-[1.85] text-[#6F6258]">{story}</p>

          <div className="mt-7 max-w-[620px] rounded-[26px] border border-[#C9A24D]/18 bg-white/52 p-7 shadow-[0_22px_60px_rgba(80,55,25,0.07)] backdrop-blur-xl lg:p-8">
            <p className="font-serif text-[26px] font-normal leading-[1.35] text-[#2C241F]">“{style}”</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="min-h-[110px] rounded-[20px] border border-[#C9A24D]/16 bg-white/62 p-5 shadow-[0_14px_40px_rgba(80,55,25,0.06)]">
                  <Icon className="mb-4 text-[#C9A24D]" size={22} strokeWidth={1.55} />
                  <p className="text-[15px] font-bold leading-[1.4] text-[#1E1D1B]">{item.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedReveal>
  );
}

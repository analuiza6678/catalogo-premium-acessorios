import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { Loja } from "@/types/loja";
import { AnimatedSection } from "./AnimatedSection";

export function AboutStoreSection({ loja }: { loja: Loja }) {
  const differentials = [loja.diferencial_1, loja.diferencial_2, loja.diferencial_3].filter(Boolean) as string[];
  const fallbackDiffs = differentials.length ? differentials : ["Curadoria delicada", "Peças versáteis", "Atendimento próximo"];

  return (
    <AnimatedSection id="sobre" className="bg-bege py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[38px] bg-white shadow-soft">
          {loja.capa_url ? <Image src={loja.capa_url} alt={loja.nome} fill className="object-cover" /> : <div className="h-full bg-[linear-gradient(135deg,#F8DDEB,#FFFFFF,#FAF7F2)]" />}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-dourado">Sobre a loja</p>
          <h2 className="mt-3 font-serif text-4xl text-preto sm:text-5xl">{loja.nome}</h2>
          <p className="mt-5 text-base leading-8 text-texto">
            {loja.sobre_loja || "Uma boutique de acessórios criada para valorizar detalhes delicados, peças versáteis e escolhas que deixam cada composição mais especial."}
          </p>
          <p className="mt-4 rounded-[24px] border border-rosa-bebe bg-white p-5 text-sm leading-7 text-texto">
            {loja.estilo_loja || "Estilo delicado, moderno e feminino, com peças pensadas para iluminar produções do dia a dia e momentos especiais."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {fallbackDiffs.map((item) => (
              <div key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold text-preto">
                <CheckCircle2 className="mb-2 text-dourado" size={20} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

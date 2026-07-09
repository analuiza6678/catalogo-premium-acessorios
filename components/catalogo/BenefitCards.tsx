"use client";

import { Gift, HandHeart, MessageCircle, Truck } from "lucide-react";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/utils/motion";

const benefits = [
  { icon: HandHeart, title: "Peças selecionadas", text: "Curadoria delicada para combinar com diferentes estilos." },
  { icon: MessageCircle, title: "Atendimento personalizado", text: "Tire duvidas e combine detalhes diretamente pelo WhatsApp." },
  { icon: Gift, title: "Pedido pelo WhatsApp", text: "Monte sua sacola e envie o pedido pronto para a loja." },
  { icon: Truck, title: "Entrega combinada", text: "Retirada, entrega ou envio conforme a disponibilidade da loja." }
];

export function BenefitCards() {
  return (
    <motion.section className="mx-auto max-w-7xl px-4 py-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <motion.article key={benefit.title} variants={fadeInUp} className="rounded-[28px] border border-rosa-bebe bg-white p-5 shadow-[0_14px_40px_rgba(31,31,31,0.05)]">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-rosa-bebe text-dourado">
                <Icon size={22} />
              </div>
              <h3 className="font-serif text-2xl text-preto">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-texto">{benefit.text}</p>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

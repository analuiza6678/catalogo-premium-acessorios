import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

type PremiumEmptyStateProps = {
  whatsapp: string | null;
  title: string;
  text: string;
};

export function PremiumEmptyState({ whatsapp, title, text }: PremiumEmptyStateProps) {
  const url = buildWhatsappUrl(whatsapp, "Olá! Gostaria de conhecer as novidades da loja.");
  return (
    <div className="rounded-[34px] border border-rosa-bebe bg-[linear-gradient(135deg,#FFFFFF,#FAF7F2)] p-8 text-center shadow-[0_18px_55px_rgba(31,31,31,0.05)]">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-rosa-bebe text-dourado">
        <Sparkles size={26} />
      </div>
      <h3 className="font-serif text-3xl text-preto">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-texto">{text}</p>
      {url ? (
        <Link href={url} target="_blank">
          <Button className="mt-6">Falar com a loja</Button>
        </Link>
      ) : null}
    </div>
  );
}

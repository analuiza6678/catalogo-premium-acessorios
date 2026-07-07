import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Loja } from "@/types/loja";
import { buildWhatsappUrl } from "@/lib/utils/whatsapp";

type ShopHeaderProps = {
  loja: Loja;
};

export function ShopHeader({ loja }: ShopHeaderProps) {
  const whatsappUrl = buildWhatsappUrl(loja.whatsapp, `Ola! Vim pelo catalogo da ${loja.nome}.`);

  return (
    <header className="bg-white">
      <div className="relative h-56 overflow-hidden bg-rosa-bebe sm:h-72">
        {loja.capa_url ? (
          <Image src={loja.capa_url} alt={`Capa da ${loja.nome}`} fill priority className="object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#FFFFFF_0%,#F8DDEB_42%,#FAF7F2_100%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto -mt-14 max-w-6xl px-4 pb-8 text-center">
        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-bege shadow-soft">
          {loja.logo_url ? (
            <Image src={loja.logo_url} alt={`Logo da ${loja.nome}`} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-rosa-claro font-serif text-4xl text-dourado">
              {loja.nome.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="mt-5 font-serif text-4xl font-medium text-preto sm:text-6xl">{loja.nome}</h1>
        {loja.descricao ? <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-texto sm:text-base">{loja.descricao}</p> : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {whatsappUrl ? (
            <Link href={whatsappUrl} target="_blank">
              <Button>
                <MessageCircle size={18} />
                WhatsApp
              </Button>
            </Link>
          ) : null}
          {loja.instagram ? (
            <Link href={loja.instagram.startsWith("http") ? loja.instagram : `https://instagram.com/${loja.instagram.replace("@", "")}`} target="_blank">
              <Button variant="ghost">
                <Instagram size={18} />
                Instagram
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

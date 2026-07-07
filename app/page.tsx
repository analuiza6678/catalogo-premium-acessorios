import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-bege px-4 text-center">
      <div className="max-w-xl">
        <h1 className="font-serif text-5xl text-preto">Catalogo Premium</h1>
        <p className="mt-4 leading-7 text-texto">
          Acesse o catalogo publico pelo slug da loja, por exemplo: /minha-loja/shop.
        </p>
        <Link href="/login">
          <Button className="mt-6">Entrar no painel</Button>
        </Link>
      </div>
    </main>
  );
}

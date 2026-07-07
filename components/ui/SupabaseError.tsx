import { Card } from "./Card";

type SupabaseErrorProps = {
  message?: string;
};

export function SupabaseError({ message }: SupabaseErrorProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-bege px-4">
      <Card className="max-w-xl p-6 text-center">
        <h1 className="font-serif text-4xl text-preto">Nao consegui carregar o catalogo</h1>
        <p className="mt-3 leading-7 text-texto">
          O app tentou consultar o Supabase, mas recebeu um erro de conexao ou configuracao.
        </p>
        {message ? <p className="mt-4 rounded-2xl bg-rosa-bebe px-4 py-3 text-sm text-preto">{message}</p> : null}
        <p className="mt-4 text-sm text-texto/80">
          Confira se a URL em .env.local e igual ao Project URL em Project Settings &gt; API no Supabase.
        </p>
      </Card>
    </main>
  );
}

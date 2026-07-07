import { Card } from "./Card";

export function SetupRequired() {
  return (
    <main className="grid min-h-screen place-items-center bg-bege px-4">
      <Card className="max-w-xl p-6 text-center">
        <h1 className="font-serif text-4xl text-preto">Conecte o Supabase</h1>
        <p className="mt-3 leading-7 text-texto">
          Para carregar loja, produtos, login e uploads, crie um arquivo <strong>.env.local</strong> com
          NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
        <p className="mt-3 text-sm text-texto/80">Use o modelo em .env.example e aplique a migration SQL no seu projeto Supabase.</p>
      </Card>
    </main>
  );
}

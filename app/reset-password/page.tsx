"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));

    if (password.length < 6) {
      setLoading(false);
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("As senhas não conferem.");
      return;
    }

    const { error: updateError } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError("Não foi possível atualizar a senha. Abra novamente o link recebido por e-mail.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_20%,rgba(215,174,74,0.12),transparent_30%),linear-gradient(135deg,#FAF6EF,#F5EDE2_56%,#EFE3D4)] px-5 py-10">
      <section className="w-full max-w-[520px] rounded-[34px] border border-[#C9A24D]/18 bg-white/72 p-6 shadow-[0_32px_90px_rgba(80,55,25,0.13)] backdrop-blur-xl sm:p-9">
        <div className="mb-7 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320]">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#C9A24D]">Acesso seguro</p>
            <h1 className="font-serif text-4xl leading-none text-[#1E1D1B]">Nova senha</h1>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#6F6258]">Crie uma senha nova para voltar ao painel administrativo.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="relative block">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B88A2A]" size={18} />
            <Input name="password" type="password" placeholder="Nova senha" required className="min-h-14 rounded-2xl border-[#C9A24D]/22 bg-white/76 pl-12" />
          </label>
          <label className="relative block">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B88A2A]" size={18} />
            <Input name="confirmPassword" type="password" placeholder="Confirmar nova senha" required className="min-h-14 rounded-2xl border-[#C9A24D]/22 bg-white/76 pl-12" />
          </label>
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <Button className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] shadow-[0_18px_40px_rgba(168,121,33,0.22)]" disabled={loading}>
            {loading ? "Salvando..." : "Salvar nova senha"}
            <ArrowRight size={18} />
          </Button>
        </form>
      </section>
    </main>
  );
}

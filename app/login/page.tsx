"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "recover">("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const { error: authError } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password"))
    });
    setLoading(false);
    if (authError) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleRecover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const origin = window.location.origin;
    const { error: recoverError } = await createClient().auth.resetPasswordForEmail(String(form.get("email")), {
      redirectTo: `${origin}/reset-password`
    });
    setLoading(false);
    if (recoverError) {
      setError("Não foi possível enviar o e-mail de recuperação. Confira o endereço e tente novamente.");
      return;
    }
    setMessage("Enviamos um link para você criar uma nova senha.");
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_18%,rgba(215,174,74,0.12),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(234,219,200,0.62),transparent_32%),linear-gradient(135deg,#FAF6EF_0%,#F5EDE2_56%,#EFE3D4_100%)] px-5 py-10 lg:grid-cols-[1fr_520px] lg:px-[clamp(40px,7vw,120px)]">
      <div className="pointer-events-none absolute -left-36 top-24 h-[480px] w-[480px] rounded-full border border-[#C9A24D]/10 bg-white/20" />
      <section className="relative z-10 hidden max-w-3xl flex-col justify-center lg:flex">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[#C9A24D]/20 bg-white/55 px-5 py-3 text-sm font-semibold text-[#6F6258] shadow-[0_18px_55px_rgba(80,55,25,0.08)]">
          <ShieldCheck size={18} className="text-[#B88A2A]" />
          Painel privado da boutique
        </div>
        <h1 className="mt-8 max-w-[760px] font-serif text-[clamp(64px,7vw,104px)] font-normal leading-[0.94] tracking-[-0.04em] text-[#1E1D1B]">
          Gestão elegante para o seu catálogo.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#6F6258]">
          Cadastre produtos, acompanhe indicadores e mantenha a vitrine pronta para pedidos pelo WhatsApp.
        </p>
      </section>

      <section className="relative z-10 flex items-center justify-center">
        <div className="w-full max-w-[520px] rounded-[34px] border border-[#C9A24D]/18 bg-white/70 p-6 shadow-[0_32px_90px_rgba(80,55,25,0.13)] backdrop-blur-xl sm:p-9">
          <div className="mb-8 flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full border border-[#C9A24D]/40 font-serif text-2xl text-[#A87921]">M</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#C9A24D]">Minha Loja</p>
              <h2 className="font-serif text-4xl leading-none text-[#1E1D1B]">{mode === "login" ? "Entrar no painel" : "Recuperar senha"}</h2>
            </div>
          </div>

          <p className="text-sm leading-6 text-[#6F6258]">
            {mode === "login"
              ? "Acesse para gerenciar produtos, categorias, fotos e informações da loja."
              : "Informe seu e-mail para receber um link seguro de criação de nova senha."}
          </p>

          <form onSubmit={mode === "login" ? handleLogin : handleRecover} className="mt-7 space-y-4">
            <label className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B88A2A]" size={18} />
              <Input name="email" type="email" placeholder="E-mail" required className="min-h-14 rounded-2xl border-[#C9A24D]/22 bg-white/76 pl-12" />
            </label>

            {mode === "login" ? (
              <label className="relative block">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B88A2A]" size={18} />
                <Input name="password" type="password" placeholder="Senha" required className="min-h-14 rounded-2xl border-[#C9A24D]/22 bg-white/76 pl-12" />
              </label>
            ) : null}

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}

            <Button className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#D7AE4A,#A87921)] shadow-[0_18px_40px_rgba(168,121,33,0.22)]" disabled={loading}>
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Enviar link de recuperação"}
              <ArrowRight size={18} />
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "recover" : "login");
              setError("");
              setMessage("");
            }}
            className="mt-5 w-full text-center text-sm font-semibold text-[#A87921] hover:text-[#1E1D1B]"
          >
            {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
          </button>
        </div>
      </section>
    </main>
  );
}

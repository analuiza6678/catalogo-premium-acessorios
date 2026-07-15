"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutTemplate, LogOut, Package, Palette, Settings, Sparkles, Tags } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const items = [
  { href: "/dashboard", label: "Visão geral", icon: Home },
  { href: "/dashboard/produtos", label: "Produtos", icon: Package },
  { href: "/dashboard/categorias", label: "Categorias", icon: Tags },
  { href: "/dashboard/vitrine", label: "Editar vitrine", icon: LayoutTemplate },
  { href: "/dashboard/aparencia", label: "Aparência", icon: Palette },
  { href: "/dashboard/perfil", label: "Perfil da loja", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[304px] shrink-0 border-r border-[#C9A24D]/16 bg-[#FFFDF9]/78 p-5 shadow-[18px_0_60px_rgba(80,55,25,0.06)] backdrop-blur-xl lg:block">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-[24px] border border-[#C9A24D]/18 bg-white/60 p-4 shadow-[0_16px_45px_rgba(80,55,25,0.06)]">
        <span className="grid size-12 place-items-center rounded-full border border-[#C9A24D]/45 font-serif text-2xl text-[#A87921]">M</span>
        <div>
          <p className="font-serif text-2xl leading-none text-[#1E1D1B]">Minha Loja</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A87921]">Admin Boutique</p>
        </div>
      </Link>

      <div className="mt-6 rounded-[24px] border border-[#C9A24D]/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(247,239,227,0.72))] p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#F4D892,#D7AE4A)] text-[#4A3320]">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1E1D1B]">Catálogo ativo</p>
            <p className="mt-1 text-xs leading-5 text-[#6F6258]">Acompanhe vitrine, pedidos e estoque.</p>
          </div>
        </div>
      </div>

      <nav className="mt-7 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-[linear-gradient(135deg,#D7AE4A,#A87921)] text-white shadow-[0_16px_35px_rgba(168,121,33,0.18)]"
                  : "text-[#6F6258] hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#1E1D1B]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button onClick={signOut} className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-3 rounded-2xl border border-[#C9A24D]/16 bg-white/62 px-4 py-3 text-sm font-bold text-[#6F6258] transition hover:bg-white hover:text-red-700">
        <LogOut size={18} />
        Sair do painel
      </button>
    </aside>
  );
}

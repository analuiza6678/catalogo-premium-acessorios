"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutTemplate, Package, Palette, Settings, Tags } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/produtos", label: "Produtos", icon: Package },
  { href: "/dashboard/categorias", label: "Categorias", icon: Tags },
  { href: "/dashboard/vitrine", label: "Vitrine", icon: LayoutTemplate },
  { href: "/dashboard/aparencia", label: "Aparência", icon: Palette },
  { href: "/dashboard/perfil", label: "Perfil", icon: Settings }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 rounded-[26px] border border-[#C9A24D]/18 bg-white/86 p-2 shadow-[0_18px_55px_rgba(80,55,25,0.16)] backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-[20px] py-2 text-[10px] font-bold transition ${active ? "bg-[linear-gradient(135deg,#D7AE4A,#A87921)] text-white" : "text-[#6F6258]"}`}>
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

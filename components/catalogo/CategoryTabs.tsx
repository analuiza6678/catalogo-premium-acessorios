import Link from "next/link";
import type { Categoria } from "@/types/categoria";

type CategoryTabsProps = {
  lojaSlug: string;
  categorias: Categoria[];
  activeSlug?: string;
};

export function CategoryTabs({ lojaSlug, categorias, activeSlug }: CategoryTabsProps) {
  return (
    <nav className="sticky top-[78px] z-30 mt-8 border-y border-white/70 bg-[#FFFDF9]/75 backdrop-blur-2xl">
      <div className="scrollbar-none mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4">
        <Link
          href={`/${lojaSlug}/shop`}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
            !activeSlug ? "bg-[#C9A227] text-white shadow-[0_14px_42px_rgba(201,162,39,0.24)]" : "border border-[#F4BFD3]/60 bg-white/74 text-[#665b55] hover:border-[#C9A227] hover:text-[#3A2A24]"
          }`}
        >
          Todos
        </Link>
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/${lojaSlug}/shop/categoria/${categoria.slug}`}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeSlug === categoria.slug ? "bg-[#C9A227] text-white shadow-[0_14px_42px_rgba(201,162,39,0.24)]" : "border border-[#F4BFD3]/60 bg-white/74 text-[#665b55] hover:border-[#C9A227] hover:text-[#3A2A24]"
            }`}
          >
            {categoria.nome}
          </Link>
        ))}
      </div>
    </nav>
  );
}

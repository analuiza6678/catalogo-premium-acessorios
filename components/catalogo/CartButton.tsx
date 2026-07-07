"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore } from "@/lib/cart/useCartStore";
import { CartDrawer } from "./CartDrawer";

type CartButtonProps = {
  whatsapp: string | null;
  lojaId?: string;
};

export function CartButton({ whatsapp, lojaId }: CartButtonProps) {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    function handleOpenCart() {
      setOpen(true);
    }
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  return (
    <>
      {totalItems > 0 ? (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.45 }}
          title="Seu carrinho"
          className="fixed bottom-5 right-5 z-40 grid size-16 place-items-center rounded-full bg-[linear-gradient(135deg,#E8C766,#C9A227)] text-white shadow-[0_18px_65px_rgba(201,162,39,0.36)] ring-4 ring-white/70 transition hover:-translate-y-1 md:bottom-8"
          aria-label="Abrir carrinho"
        >
          <ShoppingBag size={24} />
          <span className="absolute -right-1 -top-1 grid h-7 min-w-7 place-items-center rounded-full bg-[#F4BFD3] px-2 text-xs font-bold text-[#1E1A18] ring-2 ring-white">
            {totalItems}
          </span>
        </motion.button>
      ) : null}
      <CartDrawer open={open} onClose={() => setOpen(false)} whatsapp={whatsapp} lojaId={lojaId} />
    </>
  );
}

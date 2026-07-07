"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantidade">, quantidade?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantidade = 1) =>
        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.id === item.id);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantidade: cartItem.quantidade + quantidade }
                  : cartItem
              )
            };
          }
          return { items: [...state.items, { ...item, quantidade }] };
        }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item))
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item))
            .filter((item) => item.quantidade > 0)
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantidade, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + item.preco * item.quantidade, 0)
    }),
    { name: "catalogo-premium-cart" }
  )
);

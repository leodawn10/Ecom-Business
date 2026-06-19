'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  slug: string;
  name: string;
  priceMinor: number;
  accent: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Client-side cart (localStorage-persisted). On the roadmap this syncs to a
 * server cart via React Query; the shape stays the same so the swap is clean.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          const items = existing
            ? s.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: i.qty + qty } : i,
              )
            : [...s.items, { ...item, qty }];
          return { items, isOpen: true };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'bina-cart' },
  ),
);

export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.qty, 0);
export const selectTotal = (s: CartState) =>
  s.items.reduce((n, i) => n + i.priceMinor * i.qty, 0);

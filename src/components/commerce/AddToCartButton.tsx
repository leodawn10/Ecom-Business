'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/data/products';

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  const handle = () => {
    add({
      slug: product.slug,
      name: product.name,
      priceMinor: product.priceMinor,
      accent: product.accent,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handle}
      data-cursor={added ? 'Added' : 'Add'}
      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-pill)] px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-[var(--color-void)] transition-transform active:scale-[0.98] sm:w-auto"
      style={{
        background:
          'linear-gradient(100deg, var(--color-brass-deep), var(--color-gold-bright) 50%, var(--color-brass))',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,oklch(95%_0.05_90/0.55),transparent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%]"
      />
      <span className="relative z-10">{added ? 'Added to cart ✓' : 'Add to cart'}</span>
    </button>
  );
}

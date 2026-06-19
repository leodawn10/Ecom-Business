'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/data/products';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { CheckoutPanel } from '@/components/commerce/CheckoutPanel';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);

  return (
    <main className="page-shell mx-auto max-w-[1100px] px-[var(--space-gutter)]">
      <header>
        <p className="text-eyebrow mb-3">Your Selection</p>
        <h1 className="text-[length:var(--text-2xl)]">
          The <span className="gold-text italic">Cart</span>
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="mt-16 rounded-[var(--radius-lg)] border border-[var(--color-line)] p-12 text-center">
          <p className="text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
            Your cart is empty — the showroom awaits.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton href="/collections" cursorLabel="Enter">
              Browse Collections
            </MagneticButton>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-5 py-5">
                <Link
                  href={`/products/${item.slug}`}
                  className="h-20 w-20 shrink-0 rounded-[var(--radius-md)]"
                  style={{
                    background:
                      'radial-gradient(60% 40% at 40% 30%, oklch(92% 0.06 90 / 0.85), transparent 60%), linear-gradient(150deg, ' +
                      item.accent +
                      ', color-mix(in oklch, ' +
                      item.accent +
                      ' 45%, black))',
                  }}
                  data-cursor="View"
                  aria-label={item.name}
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] hover:text-[var(--color-gold)]">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {formatPrice(item.priceMinor)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-[var(--radius-pill)] border border-[var(--color-line)]">
                    <button
                      onClick={() => setQty(item.slug, item.qty - 1)}
                      className="px-3 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-ivory)]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.slug, item.qty + 1)}
                      className="px-3 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-ivory)]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.slug)}
                    className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)] hover:text-[var(--color-copper)]"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <CheckoutPanel />
        </div>
      )}
    </main>
  );
}

'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { CONTACT } from '@/data/site';
import { MagneticButton } from '@/components/ui/MagneticButton';

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get('order') ?? '';
  const clear = useCartStore((s) => s.clear);

  // The order is placed; empty the local cart once on arrival.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="page-shell mx-auto flex max-w-[760px] flex-col items-center px-[var(--space-gutter)] text-center">
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full text-3xl text-[var(--color-void)]"
        style={{ background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-brass-deep))' }}
        aria-hidden
      >
        ✓
      </div>
      <p className="text-eyebrow mb-3">Order Received</p>
      <h1 className="text-[length:var(--text-2xl)]">
        Thank you — your pieces are <span className="gold-text italic">reserved.</span>
      </h1>
      <p className="mt-5 max-w-[40rem] text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
        Our team will call you to confirm payment and delivery. Each piece is
        inspected and hand-wrapped before it leaves the workshop.
      </p>

      {orderId && (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] px-8 py-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Order reference
          </p>
          <p className="mt-1 break-all font-mono text-sm text-[var(--color-gold)]">{orderId}</p>
        </div>
      )}

      <p className="mt-8 text-sm text-[var(--color-text-muted)]">
        Need anything? Call{' '}
        <a href={CONTACT.phoneHref} className="text-[var(--color-gold)]">
          {CONTACT.phoneDisplay}
        </a>{' '}
        · {CONTACT.hours}
      </p>

      <div className="mt-10">
        <MagneticButton href="/collections" cursorLabel="Browse">
          Continue Exploring
        </MagneticButton>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="page-shell" />}>
      <SuccessInner />
    </Suspense>
  );
}

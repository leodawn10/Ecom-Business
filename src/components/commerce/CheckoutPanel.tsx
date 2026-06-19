'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, selectCount, selectTotal } from '@/store/useCartStore';
import { createRazorpayOrder, confirmRazorpayPayment } from '@/app/actions';
import { formatPrice } from '@/data/products';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Stage = 'summary' | 'form';

export function CheckoutPanel() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCount);
  const total = useCartStore(selectTotal);

  const [stage, setStage] = useState<Stage>('summary');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const created = await createRazorpayOrder({
      customer: form,
      items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
    });
    if (!created.ok) {
      setBusy(false);
      setError(created.message);
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      setBusy(false);
      setError('Could not load the payment window. Check your connection.');
      return;
    }

    const rzp = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      order_id: created.razorpayOrderId,
      name: 'BINA Heritage Metalware',
      description: `Order ${created.orderId.slice(0, 8)}`,
      prefill: created.prefill,
      theme: { color: '#b8893b' },
      handler: async (resp: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        const verified = await confirmRazorpayPayment({
          orderId: created.orderId,
          razorpayOrderId: resp.razorpay_order_id,
          razorpayPaymentId: resp.razorpay_payment_id,
          signature: resp.razorpay_signature,
        });
        if (verified.ok) {
          router.push(`/checkout/success?order=${created.orderId}`);
        } else {
          setBusy(false);
          setError(
            'We could not verify your payment. If money was deducted, please call us — your order reference is ' +
              created.orderId,
          );
        }
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.open();
  };

  return (
    <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] p-7 lg:sticky lg:top-28">
      <h2 className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)]">Summary</h2>
      <div className="mt-5 flex justify-between text-[var(--color-text-muted)]">
        <span>{count} item{count !== 1 ? 's' : ''}</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="hairline my-5" />
      <div className="flex justify-between text-[length:var(--text-lg)]">
        <span>Total</span>
        <span className="gold-text font-[family-name:var(--font-serif)]">{formatPrice(total)}</span>
      </div>

      {stage === 'summary' ? (
        <button
          onClick={() => setStage('form')}
          className="mt-7 w-full rounded-[var(--radius-pill)] px-6 py-4 text-sm font-medium uppercase tracking-[0.1em] text-[var(--color-void)] transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(100deg, var(--color-brass-deep), var(--color-gold-bright))' }}
          data-cursor="Checkout"
        >
          Proceed to Checkout
        </button>
      ) : (
        <form onSubmit={pay} className="mt-6 space-y-3">
          <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" required />
          <Field label="Email (for receipt)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          {error && <p className="text-xs leading-relaxed text-[var(--color-copper)]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[var(--radius-pill)] px-6 py-4 text-sm font-medium uppercase tracking-[0.1em] text-[var(--color-void)] transition-transform active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(100deg, var(--color-brass-deep), var(--color-gold-bright))' }}
            data-cursor="Pay"
          >
            {busy ? 'Opening payment…' : `Pay ${formatPrice(total)} securely`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[var(--color-text-muted)]">
            <span aria-hidden>🔒</span> Secured by Razorpay · UPI, cards, netbanking &amp; wallets
          </p>
        </form>
      )}
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-void)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brass)]"
      />
    </label>
  );
}

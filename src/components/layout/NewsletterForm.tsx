'use client';

import { useActionState } from 'react';
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions';

const INITIAL: NewsletterState = { ok: false, message: '' };

/** Footer newsletter sign-up, persisted to Supabase `subscribers`. */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, INITIAL);

  return (
    <div className="mt-7 max-w-sm">
      <form action={action} className="flex items-center gap-2 border-b border-[var(--color-line)] pb-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Join the heritage list"
          aria-label="Email address"
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
        />
        <button
          type="submit"
          disabled={pending}
          data-cursor="Send"
          className="text-sm uppercase tracking-[0.12em] text-[var(--color-brass)] disabled:opacity-50"
        >
          {pending ? '…' : 'Subscribe'}
        </button>
      </form>
      {state.message && (
        <p
          className="mt-2 text-xs"
          style={{ color: state.ok ? 'var(--color-gold)' : 'var(--color-copper)' }}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

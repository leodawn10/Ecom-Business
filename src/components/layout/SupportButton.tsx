'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CONTACT } from '@/data/site';

/** Always-on floating concierge: call, WhatsApp, or open the support page. */
export function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] p-5 shadow-[var(--shadow-lift)]"
          >
            <p className="text-eyebrow mb-1">Heritage Concierge</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Speak to a real person about any piece, gifting or orders.
            </p>
            <a
              href={CONTACT.phoneHref}
              data-cursor="Call"
              className="mt-4 block font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] gold-text"
            >
              {CONTACT.phoneDisplay}
            </a>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{CONTACT.hours}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={CONTACT.whatsappHref}
                data-cursor="Chat"
                className="rounded-[var(--radius-pill)] border border-[var(--color-line)] py-2 text-center text-xs uppercase tracking-[0.08em] transition-colors hover:border-[var(--color-brass)]"
              >
                WhatsApp
              </a>
              <a
                href="/support"
                data-cursor="Open"
                className="rounded-[var(--radius-pill)] border border-[var(--color-line)] py-2 text-center text-xs uppercase tracking-[0.08em] transition-colors hover:border-[var(--color-brass)]"
              >
                Help Centre
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Customer support"
        data-cursor={open ? 'Close' : 'Help'}
        className="flex h-14 w-14 items-center justify-center rounded-full text-[var(--color-void)] shadow-[var(--glow-brass)] transition-transform hover:scale-105 active:scale-95"
        style={{
          background:
            'linear-gradient(135deg, var(--color-gold-bright), var(--color-brass-deep))',
        }}
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-2xl leading-none">
          {open ? '+' : '☎'}
        </motion.span>
      </button>
    </div>
  );
}

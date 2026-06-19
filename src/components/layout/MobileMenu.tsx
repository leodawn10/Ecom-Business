'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { collections } from '@/data/collections';
import { CONTACT, NAV_LINKS } from '@/data/site';

/** Full-screen heritage drawer for small screens. */
export function MobileMenu({ count }: { count: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('lenis-stopped', open);
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
      >
        <span className="h-px w-6 bg-[var(--color-ivory)]" />
        <span className="h-px w-6 bg-[var(--color-ivory)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] flex flex-col bg-[var(--color-void)] px-[var(--space-gutter)] py-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-serif)] text-2xl gold-text" style={{ fontWeight: 600 }}>
                BINA
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-3xl leading-none text-[var(--color-ivory)]">
                ×
              </button>
            </div>

            <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[var(--color-line)] py-4 font-[family-name:var(--font-serif)] text-[length:var(--text-xl)]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <p className="text-eyebrow mt-8 mb-2">Rooms</p>
              <div className="grid grid-cols-2 gap-x-4">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="border-b border-[var(--color-line)] py-3 text-[var(--color-text-muted)]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-6 flex items-center justify-between">
              <Link href="/cart" onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.12em]">
                Cart <span className="text-[var(--color-brass)]">({count})</span>
              </Link>
              <a href={CONTACT.phoneHref} className="gold-text font-[family-name:var(--font-serif)] text-[length:var(--text-lg)]">
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

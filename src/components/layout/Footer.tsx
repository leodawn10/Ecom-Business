import Link from 'next/link';
import { collections } from '@/data/collections';
import { CONTACT } from '@/data/site';
import { NewsletterForm } from '@/components/layout/NewsletterForm';

const COLS = [
  {
    title: 'Collections',
    links: collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  },
  {
    title: 'The House',
    links: [
      { label: 'Our 113 Years', href: '/#heritage' },
      { label: 'The Craft', href: '/#craft' },
      { label: 'Meet the Makers', href: '/artisans' },
      { label: 'Virtual Museum', href: '/museum' },
    ],
  },
  {
    title: 'Service',
    links: [
      { label: 'Customer Support', href: '/support' },
      { label: 'Care & Patina', href: '/care' },
      { label: 'Gifting & Personalisation', href: '/gifting' },
      { label: 'Corporate & Bulk', href: '/corporate' },
      { label: 'Shipping & Returns', href: '/shipping' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] px-[var(--space-gutter)] pb-12 pt-[var(--space-section)]">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-[family-name:var(--font-serif)] text-4xl gold-text" style={{ fontWeight: 600 }}>
              BINA
            </span>
            <p className="mt-4 max-w-[26rem] text-[var(--color-text-muted)]">
              A living museum of handcrafted Indian metalware. Brass, copper,
              bell-metal and silver, shaped by hand since 1911.
            </p>

            <div className="mt-6">
              <p className="text-eyebrow mb-1">Customer Care</p>
              <a href={CONTACT.phoneHref} className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] gold-text" data-cursor="Call">
                {CONTACT.phoneDisplay}
              </a>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {CONTACT.hours} · <a href={CONTACT.whatsappHref} className="hover:text-[var(--color-ivory)]">WhatsApp</a> ·{' '}
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[var(--color-ivory)]">{CONTACT.email}</a>
              </p>
            </div>

            <NewsletterForm />
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-5 text-xs uppercase tracking-[0.18em] text-[var(--color-brass)]">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-ivory)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-[var(--color-text-muted)] md:flex-row">
          <p>© {new Date().getFullYear()} BINA Heritage Metalware. Crafted with fire and patience.</p>
          <p className="uppercase tracking-[0.12em]">Est. 1911 · Made in India</p>
        </div>
      </div>
    </footer>
  );
}

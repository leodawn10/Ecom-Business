import Link from 'next/link';
import { type InfoPageContent } from '@/data/site';
import { CONTACT } from '@/data/site';

/** Shared editorial layout for service/experience content pages. */
export function InfoPage({ content }: { content: InfoPageContent }) {
  return (
    <main className="page-shell mx-auto max-w-[820px] px-[var(--space-gutter)]">
      <nav className="text-sm text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-ivory)]">Home</Link>
        <span className="px-2">/</span>
        <span className="text-[var(--color-ivory)]">{content.title}</span>
      </nav>

      <header className="mt-10">
        <p className="text-eyebrow mb-4">{content.eyebrow}</p>
        <h1 className="text-[length:var(--text-2xl)]">{content.title}</h1>
        <p className="mt-5 text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
          {content.intro}
        </p>
      </header>

      <div className="hairline my-12" />

      <div className="space-y-10">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] text-[var(--color-ivory)]">
              {s.heading}
            </h2>
            <p className="mt-3 leading-[1.7] text-[var(--color-text-muted)]">{s.body}</p>
          </section>
        ))}
      </div>

      <aside className="mt-14 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 text-center">
        <p className="text-eyebrow mb-3">Talk to us</p>
        <a
          href={CONTACT.phoneHref}
          data-cursor="Call"
          className="font-[family-name:var(--font-serif)] text-[length:var(--text-xl)] gold-text"
        >
          {CONTACT.phoneDisplay}
        </a>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{CONTACT.hours}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
          <a href={CONTACT.whatsappHref} className="text-[var(--color-gold)] hover:underline" data-cursor="Chat">
            WhatsApp
          </a>
          <a href={`mailto:${CONTACT.email}`} className="text-[var(--color-gold)] hover:underline" data-cursor="Email">
            {CONTACT.email}
          </a>
        </div>
      </aside>
    </main>
  );
}

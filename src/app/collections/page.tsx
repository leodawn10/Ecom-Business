import type { Metadata } from 'next';
import Link from 'next/link';
import { collections } from '@/data/collections';
import { getCollectionCounts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Collections — Six Metals, One Inheritance',
  description:
    'Explore BINA’s six heritage collections: brass, copper, bell-metal, silver, decor and temple. Over 180 handcrafted pieces.',
  alternates: { canonical: '/collections' },
};

export const revalidate = 3600;

export default async function CollectionsIndex() {
  const counts = await getCollectionCounts();
  return (
    <main className="page-shell">
      <header className="mx-auto max-w-[1200px] px-[var(--space-gutter)] text-center">
        <p className="text-eyebrow mb-4">The Showroom</p>
        <h1 className="text-[length:var(--text-2xl)]">
          Six rooms. <span className="gold-text italic">One inheritance.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[40rem] text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
          Each collection is a metal, an age, and the hands that shaped it.
          Step into any room to browse the full range.
        </p>
      </header>

      <section className="mx-auto mt-16 grid max-w-[1400px] gap-6 px-[var(--space-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const count = counts[c.slug] ?? 0;
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] p-8 transition-all duration-500 hover:-translate-y-2"
              style={{ ['--c-accent' as string]: c.accent }}
              data-cursor="Enter room"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background:
                    'radial-gradient(70% 60% at 50% 30%, color-mix(in oklch, var(--c-accent) 32%, transparent), transparent 70%)',
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,oklch(14%_0.01_60/0.85),transparent_55%)]" />
              <div className="relative">
                <p className="text-eyebrow" style={{ color: 'var(--c-accent)' }}>
                  {c.metal} · {c.era}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-serif)] text-[length:var(--text-2xl)]">
                  {c.name}
                </h2>
                <p className="mt-2 max-w-[24rem] text-[var(--color-text-muted)]">{c.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-[var(--color-ivory)]">
                  {count} pieces
                  <span className="transition-transform duration-500 group-hover:translate-x-2" style={{ color: 'var(--c-accent)' }}>
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

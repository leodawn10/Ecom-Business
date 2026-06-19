import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { collections } from '@/data/collections';
import { getCollectionProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/commerce/ProductCard';

// Statically generated at build, revalidated hourly (ISR).
export const revalidate = 3600;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.name} Collection — ${c.tagline}`,
    description: c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: `${c.name} · BINA`, description: c.description },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const items = await getCollectionProducts(slug);

  return (
    <main className="page-shell" style={{ ['--c-accent' as string]: collection.accent }}>
      {/* room ambience */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--c-accent) 16%, transparent), transparent 70%)',
        }}
      />

      <nav className="mx-auto max-w-[1400px] px-[var(--space-gutter)] text-sm text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-ivory)]">Home</Link>
        <span className="px-2">/</span>
        <Link href="/collections" className="hover:text-[var(--color-ivory)]">Collections</Link>
        <span className="px-2">/</span>
        <span className="text-[var(--color-ivory)]">{collection.name}</span>
      </nav>

      <header className="mx-auto mt-8 max-w-[1400px] px-[var(--space-gutter)]">
        <p className="text-eyebrow" style={{ color: 'var(--c-accent)' }}>
          {collection.metal} · {collection.era}
        </p>
        <h1 className="mt-3 text-[length:var(--text-2xl)]">{collection.name}</h1>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-[42rem] text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
            {collection.description}
          </p>
          <span className="text-sm uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {items.length} pieces
          </span>
        </div>
        <div className="hairline mt-8" />
      </header>

      <section className="mx-auto mt-10 grid max-w-[1400px] gap-6 px-[var(--space-gutter)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </section>
    </main>
  );
}

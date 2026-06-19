import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/data/products';
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from '@/lib/catalog';
import { collections } from '@/data/collections';
import { ProductCard } from '@/components/commerce/ProductCard';
import { AddToCartButton } from '@/components/commerce/AddToCartButton';
import { CONTACT } from '@/data/site';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${formatPrice(p.priceMinor)}`,
    description: p.shortDesc,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.shortDesc },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const collection = collections.find((c) => c.slug === product.category);
  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc,
    category: product.collectionName,
    brand: { '@type': 'Brand', name: 'BINA Heritage Metalware' },
    offers: {
      '@type': 'Offer',
      price: (product.priceMinor / 100).toFixed(0),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  const specs = [
    ['Metal', product.purity],
    ['Weight', `${product.weightGrams} g`],
    ['Dimensions', product.dimensions],
    ['Collection', product.collectionName],
    ['Origin', 'Handcrafted in India · Est. 1911'],
  ];

  return (
    <main className="page-shell" style={{ ['--c-accent' as string]: product.accent }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mx-auto max-w-[1300px] px-[var(--space-gutter)] text-sm text-[var(--color-text-muted)]">
        <Link href="/collections" className="hover:text-[var(--color-ivory)]">Collections</Link>
        <span className="px-2">/</span>
        <Link href={`/collections/${product.category}`} className="hover:text-[var(--color-ivory)]">
          {product.collectionName}
        </Link>
        <span className="px-2">/</span>
        <span className="text-[var(--color-ivory)]">{product.name}</span>
      </nav>

      <article className="mx-auto mt-8 grid max-w-[1300px] gap-12 px-[var(--space-gutter)] lg:grid-cols-2 lg:gap-16">
        {/* ── Visual stage (3D/AR viewer slots in here on roadmap) ── */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[linear-gradient(180deg,var(--color-charcoal),var(--color-ink))] lg:sticky lg:top-28 lg:self-start">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(55% 50% at 50% 40%, color-mix(in oklch, var(--c-accent) 28%, transparent), transparent 70%)',
            }}
          />
          <div
            className="relative h-[46%] w-[46%] rounded-[50%_50%_46%_46%/58%_58%_42%_42%]"
            style={{
              background:
                'radial-gradient(60% 40% at 40% 28%, oklch(94% 0.06 90 / 0.92), transparent 60%), linear-gradient(150deg, var(--c-accent), color-mix(in oklch, var(--c-accent) 45%, black))',
              boxShadow: 'inset 0 -18px 36px oklch(0% 0 0 / 0.4), 0 0 60px -12px var(--c-accent)',
            }}
          />
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            360° &amp; AR viewer · arriving in Phase 2
          </span>
        </div>

        {/* ── Detail ── */}
        <div>
          {product.badge && (
            <span className="mb-4 inline-block rounded-[var(--radius-pill)] bg-[linear-gradient(100deg,var(--color-brass-deep),var(--color-gold-bright))] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-void)]">
              {product.badge}
            </span>
          )}
          <p className="text-eyebrow" style={{ color: 'var(--c-accent)' }}>
            {product.collectionName} · {collection?.metal}
          </p>
          <h1 className="mt-2 text-[length:var(--text-2xl)] leading-[1.05]">{product.name}</h1>
          <p className="mt-4 font-[family-name:var(--font-serif)] text-[length:var(--text-xl)] gold-text">
            {formatPrice(product.priceMinor)}
          </p>
          <p className="mt-5 max-w-[40rem] text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
            {product.shortDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AddToCartButton product={product} />
            <Link
              href="/cart"
              data-cursor="View"
              className="text-sm uppercase tracking-[0.12em] text-[var(--color-ivory)] underline-offset-4 hover:underline"
            >
              View cart
            </Link>
          </div>

          {/* specs */}
          <dl className="mt-10 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {specs.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="text-sm uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{k}</dt>
                <dd className="text-right text-[var(--color-ivory)]">{v}</dd>
              </div>
            ))}
          </dl>

          {/* story */}
          <section className="mt-10">
            <h2 className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)]">The story</h2>
            <p className="mt-3 leading-[1.7] text-[var(--color-text-muted)]">{product.story}</p>
          </section>

          {/* care */}
          <section className="mt-8">
            <h2 className="font-[family-name:var(--font-serif)] text-[length:var(--text-lg)]">Care &amp; patina</h2>
            <p className="mt-3 leading-[1.7] text-[var(--color-text-muted)]">{product.care}</p>
          </section>

          {/* support */}
          <aside className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              Questions about this piece, gifting or bulk orders?
            </p>
            <a
              href={CONTACT.phoneHref}
              data-cursor="Call"
              className="mt-2 inline-flex items-center gap-2 font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] gold-text"
            >
              {CONTACT.phoneDisplay}
            </a>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{CONTACT.hours}</p>
          </aside>
        </div>
      </article>

      {/* related */}
      <section className="mx-auto mt-24 max-w-[1400px] px-[var(--space-gutter)]">
        <h2 className="mb-8 text-[length:var(--text-xl)]">
          More from <span className="gold-text italic">{product.collectionName}</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

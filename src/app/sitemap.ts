import type { MetadataRoute } from 'next';
import { collections } from '@/data/collections';
import { getAllProductSlugs } from '@/lib/catalog';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const productSlugs = await getAllProductSlugs();
  const staticRoutes = [
    '', '/collections', '/cart', '/support', '/museum', '/artisans',
    '/care', '/gifting', '/corporate', '/shipping',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.6,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes = productSlugs.map((slug) => ({
    url: `${BASE}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}

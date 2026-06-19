import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import type { Product } from '@/data/products';

type ProductRow = Database['public']['Tables']['products']['Row'];

/** DB row (snake_case) → app Product (camelCase). */
function mapProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    collectionName: r.collection_name,
    priceMinor: r.price_minor,
    weightGrams: r.weight_grams,
    purity: r.purity,
    dimensions: r.dimensions,
    shortDesc: r.short_desc,
    story: r.story,
    care: r.care,
    badge: (r.badge ?? undefined) as Product['badge'],
    accent: r.accent,
  };
}

export async function getCollectionProducts(category: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('name');
  if (error) throw new Error(`Failed to load ${category}: ${error.message}`);
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product ${slug}: ${error.message}`);
  return data ? mapProduct(data) : null;
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('slug', product.slug)
    .order('name')
    .limit(count);
  if (error) throw new Error(`Failed to load related: ${error.message}`);
  return (data ?? []).map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('products').select('slug');
  if (error) throw new Error(`Failed to load slugs: ${error.message}`);
  return (data ?? []).map((d) => d.slug);
}

export async function getCollectionCounts(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase.from('products').select('category');
  if (error) throw new Error(`Failed to count: ${error.message}`);
  return (data ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
}

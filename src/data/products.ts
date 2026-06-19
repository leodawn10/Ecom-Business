import { collections, type Collection } from './collections';

/**
 * Catalog. In production these come from Prisma; here a curated name pool per
 * category (30 each → 180 SKUs) is expanded deterministically so prices,
 * weights and specs are stable across builds (no SSR hydration drift).
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // collection slug
  collectionName: string;
  priceMinor: number; // INR paise
  weightGrams: number;
  purity: string;
  dimensions: string;
  shortDesc: string;
  story: string;
  care: string;
  badge?: 'Bestseller' | 'New' | 'Limited Edition' | 'Heirloom';
  accent: string;
}

/* ── 30 curated names per category ──────────────────────────────────────── */
const NAMES: Record<string, string[]> = {
  brass: [
    'Hand-Beaten Brass Thali', 'Engraved Brass Water Jug', 'Brass Diya Stand (Samai)',
    'Brass Kalash with Coconut Holder', 'Antique Brass Urli Bowl', 'Brass Pooja Bell (Ghanti)',
    'Brass Handi Cooking Pot', 'Floral Brass Serving Tray', 'Brass Tumbler, Set of Six',
    'Brass Incense Holder', 'Brass Peacock Oil Lamp', 'Brass Sun Wall Hanging',
    'Brass Ganesha Idol', 'Brass Spice Box (Masala Dabba)', 'Brass Rose Water Sprinkler',
    'Brass Betel Nut Box', 'Brass Temple Door Knocker', 'Brass Elephant Figurine',
    'Fluted Brass Flower Vase', 'Brass Ghee Pot with Spoon', 'Brass Hookah Base',
    'Heritage Brass Nutcracker', 'Brass Ladle Set', 'Brass Compass Sundial',
    'Brass Candle Lantern', 'Brass Paan Daan', 'Brass Surahi Water Bottle',
    'Brass Aarti Plate', 'Brass Kumkum Box', 'Brass Hanging Planter',
  ],
  copper: [
    'Pure Copper Water Bottle', 'Hammered Copper Tumbler', 'Copper Water Pot (Matka)',
    'Copper Jug with Lid', 'Copper Moscow Mule Mug', 'Copper Dinner Plate',
    'Copper Storage Vessel', 'Copper Botanical Watering Can', 'Copper Kadai Pan',
    'Copper Tongue Cleaner', 'Copper Serving Bowl', 'Copper Wine Goblet',
    'Spouted Copper Lota', 'Copper Spice Container', 'Copper Ice Bucket',
    'Copper Tea Kettle', 'Copper Measuring Cups', 'Copper Diya Set',
    'Engraved Copper Pitcher', 'Copper Thali Set', 'Copper Glass with Coaster',
    'Copper Surahi', 'Copper Handwash Basin', 'Copper Cocktail Shaker',
    'Copper Flower Bowl', 'Copper Incense Burner', 'Copper Ladle',
    'Copper Mixing Bowl', 'Copper Hip Flask', 'Copper Bedside Carafe',
  ],
  'bell-metal': [
    'Kansa Dinner Thali', 'Kansa Serving Bowl (Bati)', 'Kansa Water Tumbler',
    'Bell Metal Rice Plate', 'Kansa Spoon Set', 'Bell Metal Dessert Bowl',
    'Kansa Temple Bell', 'Bell Metal Pooja Plate', 'Heritage Kansa Glass',
    'Bell Metal Curry Bowl', 'Kansa Khaja Plate', 'Round Bell Metal Tray',
    'Kansa Lota', 'Bell Metal Diya', 'Kansa Baby Feeding Set',
    'Bell Metal Quarter Plate', 'Kansa Gravy Boat', 'Bell Metal Wine Cup',
    'Kansa Chutney Bowl', 'Bell Metal Handi', 'Kansa Tasla Bowl',
    'Bell Metal Ghee Container', 'Kansa Pickle Jar', 'Bell Metal Soup Bowl',
    'Kansa Dinner Set of Twelve', 'Bell Metal Halwa Plate', 'Kansa Lidded Tumbler',
    'Bell Metal Idol Stand', 'Kansa Aarti Thali', 'Bell Metal Decorative Urli',
  ],
  silver: [
    'Sterling Silver Pooja Thali', 'Silver Kumkum Box', 'Silver Diya Pair',
    'Silver Lakshmi Idol', 'Silver Water Glass', 'Silver Bowl with Spoon',
    'Silver Ganesha Idol', 'Engraved Silver Kalash', 'Silver Incense Holder',
    'Silver Baby Gift Set', 'Silver Lakshmi-Ganesh Coin', 'Silver Aarti Lamp',
    'Silver Rose Sprinkler', 'Silver Betel Box', 'Silver Tumbler Set',
    'Filigree Silver Photo Frame', 'Silver Agarbatti Stand', 'Embossed Silver Plate',
    'Silver Krishna Idol', 'Silver Haldi-Kumkum Holder', 'Silver Pooja Bell',
    'Heritage Silver Spoon', 'Silver Chowki Stand', 'Silver Toe-Ring Box',
    'Silver Decorative Peacock', 'Ceremonial Silver Tray', 'Silver Nandi Idol',
    'Silver Mango Leaf Garland', 'Silver Wedding Gift Box', 'Silver Tulsi Mala Holder',
  ],
  decor: [
    'Brass Abstract Wall Art', 'Metal Tree of Life Sculpture', 'Copper Geometric Vase',
    'Brass Horse Figurine', 'Metal Peacock Wall Décor', 'Brass Sun & Moon Wall Plate',
    'Sculpted Dancing Apsara', 'Brass Globe on Stand', 'Metal Lotus Centerpiece',
    'Copper Tealight Cluster', 'Brass Ship Model', 'Metal Birds on Branch',
    'Brass Hourglass', 'Sculpted Buddha Head', 'Metal Mesh Lantern',
    'Brass Camel Caravan Set', 'Sunburst Copper Mirror', 'Brass Owl Bookends',
    'Temple Metal Wind Chime', 'Brass Map Wall Hanging', 'Sculpted Nataraja',
    'Five-Arm Brass Candelabra', 'Metal Fish Sculpture', 'Copper Bowl Fountain',
    'Brass Vintage Telephone', 'Metal Elephant Procession', 'Brass Magnifying Glass',
    'Sculpted Horse Head', 'Roman Metal Wall Clock', 'Brass Decorative Spheres',
  ],
  temple: [
    'Brass Temple Diya', 'Panch Aarti Oil Lamp', 'Brass Pooja Bell',
    'Standing Oil Lamp (Samai)', 'Brass Hanging Lamp (Hundi)', 'Camphor Aarti Holder',
    'Brass Agarbatti Stand', 'Tortoise Diya', 'Brass Naga Deepam',
    'Kuthu Vilakku Lamp', 'Brass Conch (Shankh)', 'Brass Temple Toran',
    'Brass Tulsi Pot', 'Gomukhi Oil Lamp', 'Brass Shiva Lingam Set',
    'Annapakshi Hanging Lamp', 'Brass Pooja Chowki', 'Lotus Floating Diya Set',
    'Brass Trishul', 'Deep Lakshmi Lamp', 'Brass Incense Tower',
    'Nandi Diya', 'Brass Kalash Set', 'Peacock Aarti Lamp',
    'Brass Sphatik Holder', 'Hanging Temple Bell', 'Seven-Wick Ghee Diya',
    'Diya Garland of Twelve', 'Brass Om Wall Symbol', 'Elephant Lamp Pair',
  ],
};

const PURITY: Record<string, string> = {
  brass: '82% copper · 18% zinc',
  copper: '99.5% pure copper',
  'bell-metal': '78% copper · 22% tin (Kansa)',
  silver: '92.5% sterling silver',
  decor: 'Brass & mixed alloy',
  temple: 'Temple-grade brass',
};

const CARE: Record<string, string> = {
  brass:
    'Wipe with a soft, dry cloth after use. Revive the shine with tamarind or lemon-and-salt; never use abrasive scrubbers.',
  copper:
    'Hand wash only. Polish with lemon and salt to bring back the rose-gold patina. Not dishwasher safe.',
  'bell-metal':
    'Wash gently by hand. If used for cooking, re-tin (kalai) periodically. Avoid storing acidic foods for long periods.',
  silver:
    'Keep in a dry, airtight pouch. Clean with a silver cloth and avoid sulphur exposure to prevent tarnish.',
  decor:
    'Dust regularly with a dry cloth. For brass and copper, an occasional lemon-salt polish keeps the lustre alive.',
  temple:
    'Wipe clean after the lamp cools. Remove old oil and wicks; an occasional tamarind polish restores the glow.',
};

const BASE_PRICE: Record<string, number> = {
  brass: 1800, copper: 2200, 'bell-metal': 2600, silver: 8500, decor: 3200, temple: 1500,
};

const INTROS = [
  'hand-beaten from a single sheet and finished by a single artisan',
  'shaped over a wooden stake and tuned by ear in the old way',
  'forged with a century-old technique and a contemporary eye',
  'cast, chased and polished entirely by hand',
];

const BADGES: Product['badge'][] = ['Bestseller', undefined, 'New', undefined, 'Heirloom', undefined, 'Limited Edition'];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildProduct(c: Collection, name: string, i: number): Product {
  const base = BASE_PRICE[c.slug];
  const price = base + ((i * 173) % 12) * 250 + (i % 5) * 90;
  const roundedPrice = Math.round(price / 10) * 10;
  const weight = 180 + ((i * 89) % 1500);
  const height = 8 + ((i * 7) % 34);
  const width = 6 + ((i * 11) % 22);
  const intro = INTROS[i % INTROS.length];

  return {
    id: `${c.slug}-${i + 1}`,
    slug: `${c.slug}-${slugify(name)}`,
    name,
    category: c.slug,
    collectionName: c.name,
    priceMinor: roundedPrice * 100,
    weightGrams: weight,
    purity: PURITY[c.slug],
    dimensions: `${height} cm H × ${width} cm Ø`,
    shortDesc: `${c.name} ${c.metal.toLowerCase() === c.name.toLowerCase() ? '' : `(${c.metal}) `}— ${intro}.`,
    story: `The ${name} is ${intro}. Drawn from BINA's heritage of ${c.name.toLowerCase()} work since 1911, it carries the quiet imperfections that mark a piece made by hand rather than machine — the warmth of metal meant to be lived with, used, and passed on.`,
    care: CARE[c.slug],
    badge: BADGES[i % BADGES.length],
    accent: c.accent,
  };
}

/* ── Build the full catalog once at module load ─────────────────────────── */
export const products: Product[] = collections.flatMap((c) =>
  NAMES[c.slug].map((name, i) => buildProduct(c, name, i)),
);

const BY_SLUG = new Map(products.map((p) => [p.slug, p]));

export function getCollectionProducts(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return BY_SLUG.get(slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, count);
}

export function formatPrice(minor: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

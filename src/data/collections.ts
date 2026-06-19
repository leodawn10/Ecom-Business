/**
 * Showroom "rooms". In production these come from the CMS / Prisma `Collection`
 * table; here they seed the immersive gallery and category routes.
 */
export interface Collection {
  slug: string;
  name: string;
  metal: string;
  tagline: string;
  description: string;
  /** OKLCH accent used for the room's lighting + UI. */
  accent: string;
  era: string;
}

export const collections: Collection[] = [
  {
    slug: 'brass',
    name: 'Brass',
    metal: 'Pital',
    tagline: 'The warm soul of the Indian home',
    description:
      'Hand-beaten brass vessels, lamps and idols — alloyed for warmth, polished for a century of light.',
    accent: 'oklch(78% 0.13 86)',
    era: 'Since 1911',
  },
  {
    slug: 'copper',
    name: 'Copper',
    metal: 'Tamba',
    tagline: 'Ayurveda forged in ember',
    description:
      'Pure copper water pots and tumblers, hammered in the old way for the living water of tradition.',
    accent: 'oklch(64% 0.14 45)',
    era: 'Ancient craft',
  },
  {
    slug: 'bell-metal',
    name: 'Bell Metal',
    metal: 'Kansa',
    tagline: 'The ringing alloy of kings',
    description:
      'Kansa thalis and bowls — bronze that sings when struck, prized across royal kitchens of Bengal.',
    accent: 'oklch(70% 0.06 110)',
    era: 'Heirloom grade',
  },
  {
    slug: 'silver',
    name: 'Silver',
    metal: 'Chandi',
    tagline: 'Moonlight for the temple',
    description:
      'Sterling pooja sets and gifting pieces, chased by hand with motifs drawn from temple lintels.',
    accent: 'oklch(85% 0.008 250)',
    era: 'Ceremonial',
  },
  {
    slug: 'decor',
    name: 'Decor',
    metal: 'Sculpture',
    tagline: 'Living rooms as galleries',
    description:
      'Wall pieces, vases and figural sculpture — metal as the centrepiece of a considered interior.',
    accent: 'oklch(72% 0.1 70)',
    era: 'Contemporary',
  },
  {
    slug: 'temple',
    name: 'Temple',
    metal: 'Devotion',
    tagline: 'For the corner that is sacred',
    description:
      'Diyas, oil lamps, bells and idols — the quiet architecture of daily prayer.',
    accent: 'oklch(82% 0.14 90)',
    era: 'Timeless',
  },
];

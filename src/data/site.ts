/** Single source of truth for contact + service-page content. */

export const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Heritage', href: '/#heritage' },
  { label: 'Craft', href: '/#craft' },
  { label: 'Support', href: '/support' },
] as const;

export const CONTACT = {
  phone: '7501875975',
  phoneDisplay: '+91 75018 75975',
  phoneHref: 'tel:+917501875975',
  whatsappHref: 'https://wa.me/917501875975',
  email: 'care@bina-heritage.com',
  hours: 'Mon–Sat · 10:00 – 19:00 IST',
} as const;

export interface InfoPageContent {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const INFO_PAGES: Record<string, InfoPageContent> = {
  support: {
    slug: 'support',
    eyebrow: 'We Are Here',
    title: 'Customer Support',
    intro:
      'Four generations of care extend to every order. Speak to a real person about products, gifting, bulk enquiries, shipping or after-sale support.',
    sections: [
      {
        heading: 'Call or WhatsApp',
        body: `Reach our care team directly at ${CONTACT.phoneDisplay}. ${CONTACT.hours}. The same number works on WhatsApp for photos, product questions and order updates.`,
      },
      {
        heading: 'Before you call',
        body: 'Keep your order number handy for faster help. For care and patina questions, our guide covers most metals in detail.',
      },
      {
        heading: 'Corporate & bulk',
        body: 'Planning weddings, festivals, or corporate gifting at scale? Call the same number and ask for the bulk desk for tailored pricing and lead times.',
      },
    ],
  },
  care: {
    slug: 'care',
    eyebrow: 'Living Metal',
    title: 'Care & Patina',
    intro:
      'Metal is alive. Cared for well, every BINA piece deepens with age into an heirloom. Here is how to keep each metal at its best.',
    sections: [
      { heading: 'Brass', body: 'Wipe dry after use. Revive shine with tamarind or lemon-and-salt; avoid abrasive scrubbers and harsh chemicals.' },
      { heading: 'Copper', body: 'Hand wash only. Lemon and salt restores the rose-gold patina. A natural darkening over time is part of its character.' },
      { heading: 'Bell Metal (Kansa)', body: 'Wash gently by hand. If used for cooking, have it re-tinned (kalai) periodically. Avoid prolonged contact with acidic foods.' },
      { heading: 'Silver', body: 'Store airtight and dry. Clean with a silver cloth; keep away from sulphur and rubber to prevent tarnish.' },
    ],
  },
  gifting: {
    slug: 'gifting',
    eyebrow: 'For the Ones Who Matter',
    title: 'Gifting & Personalisation',
    intro:
      'A gift in metal is a gift that outlives the occasion. We hand-wrap, engrave, and include a handwritten note on request.',
    sections: [
      { heading: 'Premium packaging', body: 'Every gift ships in a cloth-lined heritage box with a wax-sealed card. Preview your packaging before checkout.' },
      { heading: 'Engraving', body: 'Add names, dates or a short message to most brass, copper and silver pieces. Allow two extra days for engraved orders.' },
      { heading: 'Gift notes', body: 'Add a personal message at checkout and we will write it by hand and tuck it inside the box.' },
    ],
  },
  corporate: {
    slug: 'corporate',
    eyebrow: 'At Scale, With Soul',
    title: 'Corporate & Bulk Orders',
    intro:
      'Festival hampers, wedding favours, hotelware and corporate gifting — handcrafted, co-branded, and delivered on schedule.',
    sections: [
      { heading: 'Volume pricing', body: 'Tiered pricing from 25 units upward, with dedicated account management for large programmes.' },
      { heading: 'Co-branding', body: 'Subtle engraving or etching of your logo or message, executed by hand to match the piece.' },
      { heading: 'Lead times', body: `Talk to the bulk desk at ${CONTACT.phoneDisplay} for a quote and a realistic timeline for your quantity.` },
    ],
  },
  shipping: {
    slug: 'shipping',
    eyebrow: 'From Our Furnace to Your Door',
    title: 'Shipping & Returns',
    intro:
      'Each piece is inspected, padded and insured before it leaves us. Here is what to expect.',
    sections: [
      { heading: 'Dispatch', body: 'In-stock pieces dispatch within 2–3 working days. Engraved and made-to-order items take a little longer.' },
      { heading: 'Delivery', body: 'Pan-India delivery in 4–8 working days with tracking. International shipping available on request.' },
      { heading: 'Returns', body: 'Unused pieces may be returned within 7 days in original packaging. Personalised items are non-returnable unless damaged in transit.' },
    ],
  },
  museum: {
    slug: 'museum',
    eyebrow: 'Coming Soon',
    title: 'The Virtual Museum',
    intro:
      'An immersive, walk-through hall of our most storied pieces and the techniques behind them. Currently being built.',
    sections: [
      { heading: 'What to expect', body: 'A 3D gallery you can move through, with artifacts you can rotate, light, and read about in depth.' },
      { heading: 'Be the first in', body: `Join the heritage list in the footer, or call ${CONTACT.phoneDisplay} to arrange a private preview.` },
    ],
  },
  artisans: {
    slug: 'artisans',
    eyebrow: 'The Hands Behind the Heirloom',
    title: 'Meet the Makers',
    intro:
      'Behind every BINA piece is a named artisan and a lifetime at the furnace. Their stories are being gathered here.',
    sections: [
      { heading: 'A living craft', body: 'Skills passed from master to apprentice across four generations, still practised by hand today.' },
      { heading: 'Visit the workshop', body: `Curious to see metal shaped in person? Call ${CONTACT.phoneDisplay} to enquire about a workshop visit.` },
    ],
  },
};

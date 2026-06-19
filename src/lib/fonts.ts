import { Cormorant_Garamond, Inter } from 'next/font/google';

/**
 * Typographic pairing strategy:
 *  - Cormorant Garamond  → editorial serif for display + headings (the "museum plate")
 *  - Inter               → disciplined sans for UI + body (the "modern interaction layer")
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

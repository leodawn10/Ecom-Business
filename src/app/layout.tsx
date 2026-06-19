import type { Metadata, Viewport } from 'next';
import { cormorant, inter } from '@/lib/fonts';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LuxuryCursor } from '@/components/cursor/LuxuryCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SupportButton } from '@/components/layout/SupportButton';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BINA ECom — 113 Years of Heritage Metalware',
    template: '%s · BINA ECom',
  },
  description:
    'A living museum of handcrafted brass, copper, bell-metal and silver. Over 113 years of Indian metalware heritage, presented as an immersive luxury experience.',
  keywords: [
    'brass utensils',
    'copper utensils',
    'bell metal kansa',
    'silver pooja items',
    'handcrafted Indian metalware',
    'luxury home decor',
    'heritage craftsmanship',
  ],
  openGraph: {
    type: 'website',
    siteName: 'BINA ECom',
    title: 'BINA ECom — 113 Years of Heritage Metalware',
    description:
      'Enter the palace. A cinematic, museum-grade showroom of handcrafted Indian metalware.',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image', title: 'BINA ECom' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#1a140e',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} lenis`}
      suppressHydrationWarning
    >
      <body className="grain">
        <QueryProvider>
          <SmoothScrollProvider>
            <LuxuryCursor />
            <Navbar />
            {children}
            <Footer />
            <SupportButton />
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

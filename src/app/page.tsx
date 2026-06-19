import { PalaceDoorIntro } from '@/components/intro/PalaceDoorIntro';
import { Hero } from '@/components/hero/Hero';
import { CollectionsShowcase } from '@/components/sections/CollectionsShowcase';
import { HeritageTimeline } from '@/components/sections/HeritageTimeline';
import { CraftStory } from '@/components/sections/CraftStory';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'BINA Heritage Metalware',
  foundingDate: '1911',
  description:
    'Over 113 years of handcrafted Indian metalware — brass, copper, bell-metal and silver.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  makesOffer: ['Brass utensils', 'Copper utensils', 'Bell metal Kansa', 'Silver pooja items'],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <PalaceDoorIntro />
      <main>
        <Hero />
        <CollectionsShowcase />
        <HeritageTimeline />
        <CraftStory />
      </main>
    </>
  );
}

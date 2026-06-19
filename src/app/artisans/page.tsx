import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.artisans;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/artisans' },
};

export default function ArtisansPage() {
  return <InfoPage content={content} />;
}

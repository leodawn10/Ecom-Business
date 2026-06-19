import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.museum;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/museum' },
};

export default function MuseumPage() {
  return <InfoPage content={content} />;
}

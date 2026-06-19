import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.corporate;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/corporate' },
};

export default function CorporatePage() {
  return <InfoPage content={content} />;
}

import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.gifting;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/gifting' },
};

export default function GiftingPage() {
  return <InfoPage content={content} />;
}

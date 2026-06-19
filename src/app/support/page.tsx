import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.support;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  return <InfoPage content={content} />;
}

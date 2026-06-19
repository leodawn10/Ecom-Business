import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.care;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/care' },
};

export default function CarePage() {
  return <InfoPage content={content} />;
}

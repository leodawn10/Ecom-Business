import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { INFO_PAGES } from '@/data/site';

const content = INFO_PAGES.shipping;

export const metadata: Metadata = {
  title: content.title,
  description: content.intro,
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return <InfoPage content={content} />;
}

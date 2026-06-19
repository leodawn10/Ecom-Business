'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';

const MILESTONES = [
  { year: '1911', title: 'The first furnace', body: 'A single brass workshop opens its doors in undivided Bengal.' },
  { year: '1947', title: 'Through a new nation', body: 'The craft survives partition; the hammer never stops ringing.' },
  { year: '1978', title: 'The bell-metal years', body: 'Kansa dinnerware reaches royal kitchens across the east.' },
  { year: '2006', title: 'A fourth generation', body: 'Modern design meets century-old technique on the workbench.' },
  { year: '2024', title: 'The living museum', body: 'Heritage steps online — a showroom you can walk through.' },
];

export function HeritageTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="heritage"
      className="relative px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="text-eyebrow mb-4 text-center">A Hundred &amp; Thirteen Years</p>
        <h2 className="mb-24 text-center text-[length:var(--text-2xl)]">
          <AnimatedText text="A line of fire," by="word" />{' '}
          <span className="gold-text italic">
            <AnimatedText text="unbroken." by="word" delay={0.2} />
          </span>
        </h2>

        <div ref={ref} className="relative">
          {/* central rail */}
          <div className="absolute left-[14px] top-0 h-full w-px bg-[var(--color-line)] md:left-1/2">
            <motion.div
              className="absolute left-0 top-0 w-px origin-top bg-[linear-gradient(var(--color-gold),var(--color-brass-deep))]"
              style={{ scaleY: lineScale, height: '100%' }}
            />
          </div>

          <ul className="space-y-20">
            {MILESTONES.map((m, i) => (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? 'md:ml-0 md:pr-16 md:text-right' : 'md:ml-auto md:pl-16'
                }`}
              >
                <span
                  className={`absolute top-2 h-3 w-3 rounded-full bg-[var(--color-gold)] shadow-[var(--glow-brass)] left-[9px] md:left-auto ${
                    i % 2 === 0 ? 'md:-right-[6px]' : 'md:-left-[6px]'
                  }`}
                />
                <span className="font-[family-name:var(--font-serif)] text-[length:var(--text-xl)] gold-text">
                  {m.year}
                </span>
                <h3 className="mt-1 text-[length:var(--text-lg)]">{m.title}</h3>
                <p className="mt-2 text-[var(--color-text-muted)]">{m.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

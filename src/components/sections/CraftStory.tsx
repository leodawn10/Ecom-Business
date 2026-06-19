'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function CraftStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section
      id="craft"
      ref={ref}
      className="relative grid items-center gap-12 px-[var(--space-gutter)] py-[var(--space-section)] md:grid-cols-2 md:gap-20"
    >
      {/* parallax "image" panel (swap for a real craftsman photo) */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]">
        <motion.div
          style={{ y: yImg, scale }}
          className="absolute inset-[-10%]"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(70% 60% at 50% 30%, oklch(70% 0.12 60), oklch(30% 0.06 50) 70%, oklch(18% 0.02 50))',
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,oklch(14%_0.01_60/0.7),transparent_50%)]" />
        <p className="absolute bottom-6 left-6 font-[family-name:var(--font-serif)] text-[length:var(--text-lg)] italic text-[var(--color-ivory)]">
          “We do not make metal shine. We coax the light it already holds.”
        </p>
      </div>

      <div>
        <p className="text-eyebrow mb-4">The Hands Behind the Heirloom</p>
        <h2 className="text-[length:var(--text-2xl)] leading-[1.05]">
          <AnimatedText text="Forged, not" by="word" />{' '}
          <span className="gold-text italic">
            <AnimatedText text="manufactured." by="word" delay={0.15} />
          </span>
        </h2>
        <p className="mt-6 max-w-[36rem] text-[length:var(--text-lg)] text-[var(--color-text-muted)]">
          Every vessel passes through a single artisan from sheet to sheen —
          beaten over a wooden stake, tuned by ear, and finished by hand. No two
          are identical, because no two hours at the furnace ever are.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-6">
          {[
            ['4', 'Generations'],
            ['113', 'Years'],
            ['100%', 'Hand-finished'],
            ['7', 'Sacred metals'],
          ].map(([n, l]) => (
            <li key={l}>
              <span className="block font-[family-name:var(--font-serif)] text-[length:var(--text-xl)] gold-text">
                {n}
              </span>
              <span className="text-sm uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {l}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <MagneticButton href="#showroom" cursorLabel="Enter">
            Meet the Collection
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

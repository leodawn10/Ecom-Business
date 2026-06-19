'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import './hero.css';

// 3D is client-only and heavy → load lazily, never block first paint.
const BrassLamp = dynamic(() => import('./BrassLamp'), {
  ssr: false,
  loading: () => <div className="hero__lamp-fallback" aria-hidden />,
});

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Layer 1 — the rotating brass lamp */}
      <div className="hero__canvas" data-cursor="Drag to feel">
        <BrassLamp />
      </div>

      {/* Layer 2 — editorial type, overlapping the lamp for depth */}
      <div className="hero__content">
        <motion.p
          className="text-eyebrow hero__eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Est. 1911 · One Hundred &amp; Thirteen Years
        </motion.p>

        <h1 id="hero-heading" className="hero__title">
          <AnimatedText text="The House of" by="word" delay={0.5} />
          <span className="hero__title-accent gold-text">
            <AnimatedText text="Living Metal" by="char" delay={0.9} />
          </span>
        </h1>

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.4, duration: 1.2 }}
        >
          Brass, copper, bell-metal and silver — handcrafted across four
          generations, presented as a museum you can hold.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1 }}
        >
          <MagneticButton href="#showroom" cursorLabel="Enter">
            Enter the Showroom
          </MagneticButton>
          <MagneticButton href="#heritage" variant="ghost" cursorLabel="Read">
            Our 113 Years
          </MagneticButton>
        </motion.div>
      </div>

      {/* Layer 3 — scroll cue */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span>Scroll to walk the palace</span>
        <span className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}

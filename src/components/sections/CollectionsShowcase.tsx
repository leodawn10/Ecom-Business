'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { collections } from '@/data/collections';
import { AnimatedText } from '@/components/ui/AnimatedText';
import './showcase.css';

/**
 * The Showroom: a pinned, horizontally-scrolling corridor of "rooms".
 * Vertical scroll is translated into a lateral camera move past each metal.
 */
export function CollectionsShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // travel = (rooms - 1) panels; +1 for the intro plate
  const panels = collections.length;
  const x = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', `-${(panels / (panels + 1)) * 100}%`]),
    { stiffness: 90, damping: 24, mass: 0.6 },
  );

  return (
    <section id="showroom" ref={wrapRef} className="showcase" aria-label="Showroom collections">
      <div className="showcase__sticky">
        <motion.div className="showcase__track" style={{ x }}>
          {/* intro plate */}
          <article className="room room--intro">
            <p className="text-eyebrow">The Showroom</p>
            <h2 className="room__intro-title">
              <AnimatedText text="Six rooms." by="word" />
              <span className="gold-text">
                <AnimatedText text="One inheritance." by="word" delay={0.15} />
              </span>
            </h2>
            <p className="room__intro-copy">
              Walk the corridor. Each chamber holds a metal, an age, and the
              hands that shaped it. Keep scrolling to move between them.
            </p>
          </article>

          {collections.map((c, i) => (
            <RoomPanel key={c.slug} index={i} {...c} progress={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RoomPanel({
  slug,
  name,
  metal,
  tagline,
  description,
  accent,
  era,
  index,
}: (typeof collections)[number] & {
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  return (
    <article
      className="room"
      style={{ ['--room-accent' as string]: accent }}
      data-cursor="View room"
    >
      <div className="room__glow" />
      <span className="room__index">{String(index + 1).padStart(2, '0')}</span>

      <div className="room__pedestal">
        <div className="room__object" />
        <div className="room__object-shadow" />
      </div>

      <div className="room__meta">
        <p className="room__metal">{metal} · {era}</p>
        <h3 className="room__name">{name}</h3>
        <p className="room__tagline">{tagline}</p>
        <p className="room__desc">{description}</p>
        <a href={`/collections/${slug}`} className="room__link" data-cursor="Open">
          Explore {name}
          <span className="room__link-arrow">→</span>
        </a>
      </div>
    </article>
  );
}

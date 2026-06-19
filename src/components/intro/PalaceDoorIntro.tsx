'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import './intro.css';

const EASE = [0.83, 0, 0.17, 1] as const;

/**
 * The threshold ritual: two engraved brass doors part, golden light floods
 * out, then the store unlocks the page. Scroll is frozen while it plays.
 */
export function PalaceDoorIntro() {
  const completeIntro = useExperienceStore((s) => s.completeIntro);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      completeIntro();
      setDone(true);
      return;
    }
    document.documentElement.classList.add('lenis-stopped');
    const t1 = setTimeout(() => setOpen(true), 1600);
    const t2 = setTimeout(() => {
      completeIntro();
      document.documentElement.classList.remove('lenis-stopped');
    }, 3100);
    const t3 = setTimeout(() => setDone(true), 3700);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, [completeIntro, reduced]);

  if (reduced || done) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* golden light revealed behind the doors */}
          <div className="intro__light" data-open={open} />

          {/* left + right doors */}
          <motion.div
            className="intro__door intro__door--l"
            animate={open ? { x: '-101%' } : { x: 0 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <DoorFace side="l" />
          </motion.div>
          <motion.div
            className="intro__door intro__door--r"
            animate={open ? { x: '101%' } : { x: 0 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            <DoorFace side="r" />
          </motion.div>

          {/* maker's mark, fades before the doors part */}
          <motion.div
            className="intro__mark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: open ? 0 : 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span className="intro__mark-est">Est. 1911</span>
            <span className="intro__mark-name gold-text">BINA</span>
            <span className="intro__mark-sub">Heritage Metalware</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Engraved brass door leaf with a temple-arch motif. */
function DoorFace({ side }: { side: 'l' | 'r' }) {
  return (
    <svg
      className="intro__engrave"
      viewBox="0 0 200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={`brass-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(58% 0.1 70)" />
          <stop offset="0.5" stopColor="oklch(74% 0.12 82)" />
          <stop offset="1" stopColor="oklch(50% 0.09 65)" />
        </linearGradient>
      </defs>
      <rect width="200" height="600" fill={`url(#brass-${side})`} />
      <g
        fill="none"
        stroke="oklch(40% 0.06 60 / 0.6)"
        strokeWidth="1.4"
        transform={side === 'r' ? 'translate(200,0) scale(-1,1)' : ''}
      >
        <path d="M40 80 Q100 20 160 80 L160 520 L40 520 Z" />
        <path d="M55 110 Q100 60 145 110 L145 300 L55 300 Z" />
        <circle cx="100" cy="380" r="34" />
        <circle cx="100" cy="380" r="20" />
        <path d="M100 150 L100 240 M70 195 L130 195" />
      </g>
    </svg>
  );
}

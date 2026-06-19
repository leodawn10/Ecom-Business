'use client';

import { motion } from 'framer-motion';
import { useMemo, type ElementType } from 'react';

interface AnimatedTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Stagger delay before the first word, in seconds. */
  delay?: number;
  /** Split by word (default) or character for finer reveals. */
  by?: 'word' | 'char';
}

/**
 * Masked, blur-up reveal. Each token rises from behind a clip mask while
 * un-blurring — the signature "nothing instantly appears" entrance.
 */
export function AnimatedText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  by = 'word',
}: AnimatedTextProps) {
  const tokens = by === 'word' ? text.split(' ') : text.split('');
  const MotionTag = useMemo(() => motion.create(Tag as ElementType), [Tag]);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-12%' }}
      transition={{ staggerChildren: by === 'word' ? 0.08 : 0.025, delayChildren: delay }}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <span
          key={`${token}-${i}`}
          aria-hidden
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
            variants={{
              hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
              visible: {
                y: '0%',
                opacity: 1,
                filter: 'blur(0px)',
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {token}
            {by === 'word' ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

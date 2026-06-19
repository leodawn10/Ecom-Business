'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  className?: string;
  cursorLabel?: string;
}

/**
 * Magnetic, pull-toward-pointer button with a brass sheen. The whole element
 * eases toward the cursor; the label counter-drifts for parallax depth.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  cursorLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-pill)] px-8 py-4 text-sm font-medium tracking-[0.08em] uppercase transition-colors';
  const skin =
    variant === 'solid'
      ? 'text-[var(--color-void)]'
      : 'text-[var(--color-ivory)] border border-[var(--color-line)]';

  // Union of <a>/<button> motion props is awkward to type precisely; the
  // surface here is intentionally small, so we widen at the boundary.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp: any = href ? motion.a : motion.button;

  return (
    <Comp
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      data-cursor={cursorLabel}
      className={`${base} ${skin} ${className}`}
    >
      {variant === 'solid' && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(100deg, var(--color-brass-deep), var(--color-gold-bright) 50%, var(--color-brass))',
          }}
        />
      )}
      {/* sweeping sheen on hover */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,oklch(95%_0.05_90/0.5),transparent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%]"
      />
      <motion.span style={{ x: useSpring(x, { stiffness: 150, damping: 20 }) }}>
        {children}
      </motion.span>
    </Comp>
  );
}

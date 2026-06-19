'use client';

import { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'hover' | 'down';

/**
 * Bespoke cursor: a brass dot that tracks instantly, trailed by a softer ring
 * that eases behind it. On interactive targets the ring grows and may show a
 * label (from `data-cursor`). Native cursor is hidden only while this is active;
 * text fields keep their caret. Disabled on touch / reduced-motion.
 */
export function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<CursorMode>('default');

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add('has-lux-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest('[data-cursor]') as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], input, textarea, label');
      if (labelled) {
        setLabel(labelled.getAttribute('data-cursor') ?? '');
        setMode('hover');
      } else if (interactive) {
        setLabel('');
        setMode('hover');
      } else {
        setLabel('');
        setMode('default');
      }
    };

    const onDown = () => setMode((m) => (m === 'hover' ? 'hover' : 'down'));
    const onUp = () => setMode((m) => m);

    const loop = () => {
      // ease the ring toward the pointer (lower = laggier trail)
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-lux-cursor');
    };
  }, []);

  if (!enabled) return null;

  const ring = mode === 'hover' ? 60 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dotRef}
        className="absolute rounded-full transition-[width,height,margin] duration-200"
        style={{
          width: mode === 'hover' ? 6 : 7,
          height: mode === 'hover' ? 6 : 7,
          marginLeft: mode === 'hover' ? -3 : -3.5,
          marginTop: mode === 'hover' ? -3 : -3.5,
          background: 'var(--color-gold)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="absolute flex items-center justify-center rounded-full transition-[width,height,margin,border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: ring,
          height: ring,
          marginLeft: -ring / 2,
          marginTop: -ring / 2,
          border: '1px solid var(--color-brass)',
          background: mode === 'hover' ? 'oklch(76% 0.13 85 / 0.06)' : 'transparent',
          willChange: 'transform',
        }}
      >
        {label && (
          <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--color-gold)' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

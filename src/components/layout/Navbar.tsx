'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useCartStore, selectCount } from '@/store/useCartStore';
import { NAV_LINKS } from '@/data/site';

export function Navbar() {
  const pathname = usePathname();
  const introComplete = useExperienceStore((s) => s.introComplete);
  const count = useCartStore(selectCount);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === '/';
  const visible = !isHome || introComplete;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: isHome ? 0.2 : 0 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1600px] items-center justify-between px-[var(--space-gutter)] py-4 transition-all duration-500 md:py-5"
        style={{
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          background: scrolled
            ? 'linear-gradient(var(--color-void), transparent)'
            : 'transparent',
        }}
      >
        <Link href="/" className="flex items-baseline gap-2" data-cursor="Home">
          <span className="font-[family-name:var(--font-serif)] text-2xl tracking-[0.05em] gold-text" style={{ fontWeight: 600 }}>
            BINA
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:inline">
            Est. 1911
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                data-cursor="View"
                className="group relative text-sm uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-ivory)]"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-brass)] transition-all duration-500 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <div className="hidden sm:block">
            <SoundToggle />
          </div>
          <Link
            href="/cart"
            data-cursor="Open"
            className="text-sm uppercase tracking-[0.12em] text-[var(--color-ivory)]"
          >
            Cart{' '}
            <span className="text-[var(--color-brass)]">
              ({mounted ? count : 0})
            </span>
          </Link>
          <MobileMenu count={mounted ? count : 0} />
        </div>
      </nav>
    </motion.header>
  );
}

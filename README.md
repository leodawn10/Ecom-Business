# BINA ECom

> A living museum of handcrafted Indian metalware — brass, copper, bell-metal
> and silver — presented as an immersive, cinematic luxury experience.
> **113 years of heritage. Est. 1911.**

This is not a Shopify storefront. It is a digital palace: a cinematic
palace-door intro, a 3D rotating brass lamp, a pinned horizontal "showroom"
corridor, scroll-driven heritage storytelling, and museum-grade typography.

---




Requires **Node ≥ 20** (tested on Node 26). First `npm run dev` will fetch the
Google fonts (Cormorant Garamond + Inter) via `next/font`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | `tsc --noEmit` |

## Tech (Phase 1, shipped)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 (CSS-first
tokens) · Framer Motion · Three.js + React Three Fiber + drei · GSAP +
ScrollTrigger · Lenis smooth scroll · Zustand · React Query.

## Tech (roadmap, scaffolded in env/docs)

Prisma + PostgreSQL · NextAuth · Cloudinary · Stripe + Razorpay · Redis ·
Admin CMS · AR/3D product viewer · AI gifting · i18n (EN/HI/BN).

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture, folder
  structure, design system, component & data model, animation + 3D pipeline,
  state, auth, e-commerce flow, and the full development roadmap.

## What's built so far

- ✅ Design-system tokens (OKLCH luxury palette, fluid type, motion easings)
- ✅ Cinematic palace-door intro (`PalaceDoorIntro`)
- ✅ 3D rotating brass `samai` lamp hero with PBR metal, flame light, dust motes
- ✅ Lenis + GSAP smooth-scroll engine
- ✅ Pinned horizontal "Showroom" corridor of six metal rooms
- ✅ Scroll-driven heritage timeline + parallax craft story
- ✅ Bespoke magnetic cursor, magnetic buttons, masked text reveals
- ✅ Ambient sound toggle, accessible nav, SEO metadata + sitemap + robots +
  JSON-LD, reduced-motion fallbacks throughout

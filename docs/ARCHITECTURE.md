# BINA ECom — System Architecture

> The reference document for the BINA digital flagship. Covers the twelve
> foundations requested, then the phased roadmap that sequences the full brief.

---

## 1. System Architecture

A single Next.js 15 App Router application, deployed on the edge, backed by a
Postgres core and a media/3D CDN.

```
                          ┌─────────────────────────────┐
        Visitor ───────▶  │  CDN / Edge (Vercel)         │
                          │  - Static + ISR pages        │
                          │  - Edge middleware (geo,      │
                          │    locale, A/B, rate-limit)  │
                          └──────────────┬───────────────┘
                                         │
              ┌──────────────────────────┼───────────────────────────┐
              │                          │                           │
     ┌────────▼─────────┐      ┌─────────▼──────────┐      ┌─────────▼─────────┐
     │  React Server     │      │  Route Handlers /  │      │  Client Islands    │
     │  Components       │      │  Server Actions    │      │  (3D, motion, cart)│
     │  (catalog, SEO,   │      │  (cart, checkout,  │      │  R3F · Framer ·    │
     │   content)        │      │   auth, webhooks)  │      │   GSAP · Lenis     │
     └────────┬──────────┘      └─────────┬──────────┘      └─────────┬─────────┘
              │                           │                           │
   ┌──────────▼───────────────────────────▼───────────┐    ┌──────────▼─────────┐
   │  Data layer (Prisma)                              │    │  React Query cache  │
   │  PostgreSQL  ·  Redis (cache/session/rate-limit)  │    │  (client server-    │
   └──────────┬───────────────┬─────────────┬──────────┘    │   state)            │
              │               │             │               └────────────────────┘
       ┌──────▼─────┐  ┌──────▼─────┐ ┌─────▼──────┐
       │ Cloudinary │  │ Stripe /   │ │ NextAuth   │
       │ media+GLB  │  │ Razorpay   │ │ (sessions) │
       └────────────┘  └────────────┘ └────────────┘
```

**Principles**

- **Server-first.** Catalog, content, and SEO render as Server Components.
  Interactivity (3D, motion, cart) is isolated into small client islands.
- **One scroll authority.** Lenis owns scrolling; GSAP ScrollTrigger and Framer
  read from it. No competing scroll listeners.
- **Server state ≠ client state.** Cart/products/orders → React Query. Ephemeral
  experience state (intro done, sound, active room) → Zustand. URL holds
  shareable state (filters, sort, tab).
- **Progressive enhancement.** Every cinematic layer has a reduced-motion and
  no-WebGL fallback. The store is fully shoppable without 3D.

---

## 2. Folder Structure

```
bina-ecom/
├── docs/ARCHITECTURE.md
├── public/                     # static assets, audio, GLB/HDR (roadmap)
├── prisma/                     # schema.prisma, migrations (roadmap)
└── src/
    ├── app/
    │   ├── layout.tsx          # fonts, providers, metadata, cursor
    │   ├── page.tsx            # homepage composition + JSON-LD
    │   ├── globals.css         # @theme design tokens + base
    │   ├── sitemap.ts · robots.ts
    │   ├── (shop)/             # collections, product, cart, checkout (roadmap)
    │   ├── (experience)/       # museum, artisans, studio (roadmap)
    │   ├── (account)/          # auth, orders, wishlist (roadmap)
    │   ├── admin/              # CMS dashboard (roadmap)
    │   └── api/                # route handlers + webhooks (roadmap)
    ├── components/
    │   ├── providers/          # SmoothScroll, Query (+ Theme, i18n roadmap)
    │   ├── intro/              # PalaceDoorIntro
    │   ├── hero/               # Hero + BrassLamp (R3F)
    │   ├── sections/           # CollectionsShowcase, HeritageTimeline, CraftStory
    │   ├── layout/             # Navbar, Footer
    │   ├── cursor/             # LuxuryCursor
    │   ├── ui/                 # AnimatedText, MagneticButton, SoundToggle …
    │   ├── three/              # shared R3F primitives, loaders (roadmap)
    │   └── commerce/           # ProductCard, Cart, Checkout (roadmap)
    ├── hooks/                  # useReducedMotion, useScrollProgress …
    ├── lib/                    # fonts, cn, prisma, auth, payments (roadmap)
    ├── store/                  # Zustand stores
    ├── data/                   # seed/content (collections.ts)
    └── styles/                 # co-located *.css per feature
```

**Rule:** organise by feature/surface, not by file type. 200–400 lines/file,
800 max. Co-locate CSS with its component.

---

## 3. UI/UX Design System

**Direction:** *Dark luxury museum* — palace-at-dusk surfaces, warm metal as the
only saturated colour, editorial serif display, disciplined sans UI.

| Token group | Source of truth |
|-------------|-----------------|
| Colour (OKLCH) | `globals.css` `@theme` — void/charcoal/ink surfaces; brass/gold/copper/bell-metal/silver metals; ivory/parchment/sand neutrals |
| Typography | Cormorant Garamond (display) + Inter (UI); fluid `clamp()` scale `--text-xs … --text-hero` |
| Spacing | `--space-section`, `--space-gutter` (fluid) |
| Motion | `--duration-*`, `--ease-out-expo/quint/luxe` |
| Depth | `--shadow-soft/lift`, `--glow-brass` |
| Radii | sm/md/lg/pill |

**Laws:** never hardcode palette/type/spacing — reference tokens. Animate only
compositor-friendly properties (`transform`, `opacity`, `clip-path`, `filter`).
Semantic HTML first. Every interactive element has designed hover/focus/active
states. Four+ of the ten design-quality signals on every surface.

---

## 4. Component Architecture

Three tiers:

1. **Primitives** (`ui/`) — `AnimatedText`, `MagneticButton`, `SoundToggle`,
   `SurfaceCard`. Pure, prop-driven, reusable.
2. **Composites** (`sections/`, `hero/`, `intro/`) — own a slice of the page;
   may hold local scroll state.
3. **Containers** (`providers/`, route segments) — own data + side effects, pass
   props down. Presentational children stay pure.

Patterns: compound components for complex widgets (Tabs, ProductGallery, Cart);
headless logic (ARIA/focus/keyboard) separated from skin; container/presentational
split for data-bound views.

---

## 5. Database Schema (Prisma / PostgreSQL — roadmap)

Core entities and relations:

```
User 1─* Address
User 1─* Order 1─* OrderItem *─1 ProductVariant *─1 Product
User 1─* Review *─1 Product
User *─* Product            (Wishlist)
Product *─1 Collection
Product 1─* ProductImage
Product 1─1 Product3DAsset  (GLB url, poster, scale, env preset)
Product 1─* ProductSpec     (metal, purity, weight, dimensions, care)
Order 1─1 Payment           (Stripe/Razorpay intent, status)
Coupon · Inventory · Page (CMS) · Artisan · BlogPost · Role/Permission
```

Key fields: `Product { slug, title, story, craftStory, history, careInstructions,
metal, purity, weightGrams, priceMinor, currency, collectionId }`. Money stored
as integer minor units. Soft-delete via `archivedAt`. Audited `createdAt/updatedAt`.

---

## 6. API Architecture

- **Reads:** Server Components query Prisma directly (catalog, PDP, content).
- **Mutations:** Server Actions (`addToCart`, `updateQty`, `applyCoupon`,
  `placeOrder`, `toggleWishlist`) — colocated, type-safe, progressively enhanced.
- **Route Handlers** (`app/api/*`): payment webhooks (Stripe/Razorpay),
  search/AI endpoints, image/voice search, revalidation hooks.
- **Envelope:** `{ success, data, error, meta }` for all JSON responses.
- **Validation:** schema-validated at every boundary; never trust external data.
- **Caching:** `unstable_cache` + `revalidateTag` for catalog; Redis for sessions,
  cart snapshots, and rate-limiting.

---

## 7. Animation System

| Layer | Tool | Use |
|-------|------|-----|
| Page scroll | **Lenis** | single smooth-scroll authority |
| Scroll-bound | **GSAP ScrollTrigger** | pinning, camera moves, timelines synced to Lenis |
| Enter/exit, micro | **Framer Motion** | reveals, layout, gestures, `AnimatePresence` |
| 3D frame loop | **R3F `useFrame`** | rotation, flicker, parallax camera |

Conventions: masked blur-up reveals (`AnimatedText`); magnetic interactions
(`MagneticButton`, cursor); `will-change` applied narrowly; everything gated by
`useReducedMotion`. Timelines named by intent (`heroRevealTl`).

---

## 8. 3D Asset Pipeline

```
Artisan reference / photogrammetry
  → Blender (retopo, < 60k tris, baked normals)
  → glTF (.glb) + Draco/Meshopt compression
  → KTX2/Basis textures (PBR: albedo/roughness/metalness/normal)
  → Cloudinary CDN (versioned)
  → R3F <Suspense> lazy load · drei useGLTF · LOD + AdaptiveDpr
```

Phase-1 hero uses **procedural geometry** (`BrassLamp.tsx`: lathe profile +
procedural `Environment` lightformers) so there is zero external HDR/GLB fetch —
offline-safe and Lighthouse-friendly. Real GLBs slot into `components/three/`
behind the same `<Suspense>`/fallback contract. AR via `<model-viewer>` / WebXR
on supported devices.

**Budgets:** ≤ 1 hero canvas above the fold; DPR capped at 1.8; canvases below
the fold mount on intersection; mobile drops particle counts and shadow res.

---

## 9. State Management

| Concern | Tool |
|---------|------|
| Server state (cart, products, orders) | React Query |
| Experience state (intro, sound, room) | Zustand (`useExperienceStore`) |
| URL state (filters, sort, tab, search) | search params / route segments |
| Form state | React Hook Form (roadmap) |

Never duplicate server state into Zustand. Derive computed values; don't store
them. Optimistic cart updates with snapshot + rollback.

---

## 10. Authentication (roadmap)

NextAuth (Auth.js) with Prisma adapter. Providers: email magic-link + Google +
phone OTP (India). JWT session in httpOnly cookie. Roles: `customer`, `artisan`,
`editor`, `admin` enforced in middleware + Server Actions. CSRF on state-changing
forms; rate-limited auth endpoints (Redis). Wishlist/cart merge on login.

---

## 11. E-commerce Flow

```
Discover (Showroom/rooms) → PDP (3D viewer, story, specs, AR)
  → Add to cart (optimistic, Zustand drawer + React Query)
  → Cart review (gift note, personalisation, wrapping)
  → Auth/guest → Address → Shipping → Payment (Stripe intl / Razorpay India)
  → Webhook confirms → Order + Inventory decrement → Confirmation + tracking
```

Cross-sell: "frequently bought together", related collections, festival engine.
Post-purchase: order tracking, reviews, loyalty accrual, re-order.

---

## 12. Development Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **0 — Foundation** | Design tokens, smooth-scroll engine, cursor, intro, 3D hero, homepage sections, SEO base | ✅ shipped (this codebase) |
| **1 — Catalog** | Prisma + Postgres, Collection/Product models, collection rooms → real category pages, PDP shell, Cloudinary | next |
| **2 — 3D Product** | GLB pipeline, interactive 360° PDP viewer, AR preview, zoom, material/craft story tabs | |
| **3 — Commerce** | Cart (Zustand+RQ), checkout, Stripe + Razorpay, orders, inventory, Redis | |
| **4 — Accounts** | NextAuth, wishlist, recently-viewed, order tracking, loyalty | |
| **5 — Experience** | Virtual museum, heritage timeline page, meet-the-makers, customization studio, metal comparison lab | |
| **6 — Intelligence** | AI gifting assistant, festival recommender, image + voice search | |
| **7 — Admin** | CMS dashboard: analytics, orders, products, inventory, coupons, blogs, SEO, roles, homepage/collection/3D-asset editors | |
| **8 — Localisation & Polish** | EN/HI/BN i18n, festival themes, a11y audit (WCAG 2.2), Lighthouse 95+, cross-browser, load/perf hardening | |

**Definition of done per phase:** 80%+ test coverage (unit + integration +
critical E2E), code review (security checklist first), Lighthouse ≥ 95 on
shipped pages, reduced-motion + no-WebGL fallbacks verified.

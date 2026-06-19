'use client';

import { create } from 'zustand';

/**
 * Global, cross-cutting experience state — deliberately small.
 * Server state (cart, products, orders) lives in React Query, NOT here.
 */
interface ExperienceState {
  /** Has the cinematic palace-door intro finished? */
  introComplete: boolean;
  /** Ambient temple-bell / sitar audio toggle. */
  soundOn: boolean;
  /** Active showroom room index for the scroll-driven gallery. */
  activeRoom: number;
  completeIntro: () => void;
  toggleSound: () => void;
  setActiveRoom: (i: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  introComplete: false,
  soundOn: false,
  activeRoom: 0,
  completeIntro: () => set({ introComplete: true }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setActiveRoom: (i) => set({ activeRoom: i }),
}));

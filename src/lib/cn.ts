import { clsx, type ClassValue } from 'clsx';

/** Tiny class combiner. Kept dependency-light; swap to tailwind-merge if needed. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

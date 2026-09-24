import type Lenis from 'lenis';

// Zajednička referenca na Lenis, da ga izbornik može zaustaviti i kad se učita naknadno.
export const lenisRef: { current: Lenis | null } = { current: null };

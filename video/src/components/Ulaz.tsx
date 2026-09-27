import React from 'react';
import { useCurrentFrame } from 'remotion';
import { opruga } from '../lib/anim';

/**
 * Element ulazi u trenutku `u` (frame): izoštri se, podigne i pojavi, na oprugu.
 * Prije `u` je nevidljiv. Bez `u` je odmah prikazan (za mirne kadrove).
 */
export const Ulaz: React.FC<{
  u?: number;
  pomak?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ u, pomak = 26, style, children }) => {
  const f = useCurrentFrame();
  const p = u === undefined ? 1 : opruga(f, u, 36);
  return (
    <div
      style={{
        ...style,
        opacity: p,
        transform: `${style?.transform ?? ''} translateY(${(1 - p) * pomak}px)`,
        filter: p < 0.999 ? `blur(${(1 - p) * 10}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

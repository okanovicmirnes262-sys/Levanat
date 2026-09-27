import React from 'react';

// Vlastite, jednostavne linijske ikone (bez logotipa stvarnih servisa).
const Svg: React.FC<{ children: React.ReactNode; boja: string }> = ({ children, boja }) => (
  <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke={boja} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IkonaPoruka: React.FC<{ boja: string }> = ({ boja }) => (
  <Svg boja={boja}>
    <path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h15A3.5 3.5 0 0 1 27 8.5v9a3.5 3.5 0 0 1-3.5 3.5H14l-6 5v-5h0.5A3.5 3.5 0 0 1 5 17.5z" />
    <path d="M11 11.5h10M11 15.5h6" />
  </Svg>
);

export const IkonaAI: React.FC<{ boja: string }> = ({ boja }) => (
  <Svg boja={boja}>
    <path d="M16 4.5c.9 5.2 2.8 7.1 8 8-5.2.9-7.1 2.8-8 8-.9-5.2-2.8-7.1-8-8 5.2-.9 7.1-2.8 8-8z" />
    <path d="M25 20.5c.4 2 1.1 2.7 3 3-1.9.3-2.6 1-3 3-.4-2-1.1-2.7-3-3 1.9-.3 2.6-1 3-3z" />
  </Svg>
);

export const IkonaDokument: React.FC<{ boja: string }> = ({ boja }) => (
  <Svg boja={boja}>
    <path d="M9 4.5h10l6 6v15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-19a2 2 0 0 1 2-2z" />
    <path d="M19 4.5v6h6" />
    <path d="M11.5 18.5l3 3 6-6.5" />
  </Svg>
);

export const IkonaZvono: React.FC<{ boja: string }> = ({ boja }) => (
  <Svg boja={boja}>
    <path d="M9 21.5V14a7 7 0 0 1 14 0v7.5l2 2.5H7z" />
    <path d="M13.5 27.5a2.5 2.5 0 0 0 5 0" />
  </Svg>
);

// Fotografije s katedrale sv. Jakova (vlasništvo autora), obrađene: Real-ESRGAN 4×,
// uklanjanje pozadine, toniranje u boju kamena, zrno i karte reljefa (normal map)
// za WebGL svjetlo. Izvorni procesni skript nije dio stranice.
import g1 from '../assets/kamen/glava-1.webp';
import g1n from '../assets/kamen/glava-1-n.webp';
import g2 from '../assets/kamen/glava-2.webp';
import g2n from '../assets/kamen/glava-2-n.webp';
import g3 from '../assets/kamen/glava-3.webp';
import g3n from '../assets/kamen/glava-3-n.webp';
import g4 from '../assets/kamen/glava-4.webp';
import g4n from '../assets/kamen/glava-4-n.webp';
import g5 from '../assets/kamen/glava-5.webp';
import g5n from '../assets/kamen/glava-5-n.webp';
import mihovil from '../assets/kamen/mihovil.webp';
import katedrala from '../assets/kamen/katedrala.webp';

export type Glava = { src: ImageMetadata; normal: ImageMetadata; alt: string };

// Redoslijed: prve tri stoje u heroju početne stranice.
export const glave: Glava[] = [
  { src: g1, normal: g1n, alt: 'Kamena glava bradatog starca s kovrčavom kosom, s friza apside katedrale sv. Jakova u Šibeniku' },
  { src: g2, normal: g2n, alt: 'Kamena glava mlade žene u profilu, s valovitom kosom, s friza šibenske katedrale' },
  { src: g3, normal: g3n, alt: 'Kamena glava muškarca s brkovima i šiškama, s friza šibenske katedrale' },
  { src: g4, normal: g4n, alt: 'Kamena glava muškarca s kapom, s apside katedrale sv. Jakova' },
  { src: g5, normal: g5n, alt: 'Kamena glava muškarca s turbanom, u profilu, s apside katedrale sv. Jakova' },
];

export const kipovi = {
  mihovil: {
    src: mihovil,
    alt: 'Kip arkanđela Mihovila s kopljem, na vrhu pročelja šibenske katedrale sv. Jakova',
  },
  katedrala: {
    src: katedrala,
    alt: 'Katedrala sv. Jakova u Šibeniku, kameno pročelje s kupolom',
  },
};

// Fotografije iz Šibenika (vlasništvo autora), obrađene: Real-ESRGAN 4×,
// uklanjanje pozadine i toniranje u boju kamena.
import mihovil from '../assets/kamen/mihovil.webp';
import katedrala from '../assets/kamen/katedrala.webp';
import tvrdava from '../assets/kamen/tvrdava.webp';

export const kipovi = {
  mihovil: {
    src: mihovil,
    alt: 'Kip arkanđela Mihovila s kopljem, na vrhu pročelja šibenske katedrale sv. Jakova',
  },
  tvrdava: {
    src: tvrdava,
    alt: 'Tvrđava sv. Nikole na ulazu u šibenski kanal',
  },
  katedrala: {
    src: katedrala,
    alt: 'Katedrala sv. Jakova u Šibeniku, kameno pročelje s kupolom',
  },
};

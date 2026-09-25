// Poznati Šibenčani — sekcija na početnoj stranici. Portreti su tonirani
// u boju kamena i složeni u lučne okvire, kao glave s katedrale.
import juraj from '../assets/sibenik/juraj-dalmatinac.webp';
import vrancic from '../assets/sibenik/faust-vrancic.webp';
import supuk from '../assets/sibenik/ante-supuk.webp';
import petrovic from '../assets/sibenik/drazen-petrovic.webp';

export type Sibencanin = {
  src: ImageMetadata;
  alt: string;
  ime: string;
  godine: string;
  uloga: string;
  tekst: string;
  /** misao koja povezuje priču s mojim radom */
  misao: [string, string];
};

export const sibencani: Sibencanin[] = [
  {
    src: juraj,
    alt: 'Kip Jurja Dalmatinca, djelo Ivana Meštrovića, ispred katedrale sv. Jakova u Šibeniku',
    ime: 'Juraj Dalmatinac',
    godine: 'oko 1410.–1473.',
    uloga: 'Graditelj katedrale sv. Jakova',
    tekst:
      'Gradnju je vodio od 1441. Na apside katedrale uklesao je 71 kamenu glavu i nijedna nije ista.',
    misao: [
      '71 lice. Nijedno isto.',
      'Detalji čine razliku. Zato svaka Levanat stranica ima svoj karakter.',
    ],
  },
  {
    src: vrancic,
    alt: 'Homo volans, crtež padobrana Fausta Vrančića iz knjige Machinae novae',
    ime: 'Faust Vrančić',
    godine: '1551.–1617.',
    uloga: 'Izumitelj i jezikoslovac',
    tekst:
      'Šibenčanin koji je u knjizi Machinae novae nacrtao Homo volans, jedan od najranijih nacrta padobrana.',
    misao: [
      'Od ideje do izvedbe.',
      'Dobra ideja vrijedi tek kada postane nešto što stvarno radi.',
    ],
  },
  {
    src: supuk,
    alt: 'Portret Ante Šupuka, gradonačelnika Šibenika',
    ime: 'Ante Šupuk',
    godine: '1838.–1904.',
    uloga: 'Gradonačelnik Šibenika',
    tekst:
      'Gradonačelnik za čijeg je mandata Šibenik 1895. dobio javnu rasvjetu na izmjeničnu struju, iz hidroelektrane Jaruga na Krki.',
    misao: [
      'Šibenik se može mijenjati.',
      'Dobra web stranica ne treba samo izgledati dobro. Treba pomoći Vašem poslu da raste.',
    ],
  },
  {
    src: petrovic,
    alt: 'Dražen Petrović u dresu Šibenke s brojem 4, s loptom na terenu',
    ime: 'Dražen Petrović',
    godine: '1964.–1993.',
    uloga: 'Košarkaš',
    tekst:
      'Iz šibenske dvorane i dresa Šibenke stigao je do NBA lige i Kuće slavnih.',
    misao: [
      'Biti prepoznatljiv.',
      'Vaša stranica treba jasno pokazati tko ste i po čemu ste drugačiji.',
    ],
  },
];

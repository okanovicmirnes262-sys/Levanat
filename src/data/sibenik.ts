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
      'Od 1441. vodio je gradnju šibenske katedrale i na njezine apside uklesao 71 kamenu glavu. Nijedna nije ista. Njegov kip, djelo Ivana Meštrovića, i danas stoji ispred katedrale.',
    misao: [
      'Detalj je potpis.',
      'Svaka web stranica koju izrađujem u Šibeniku nastaje s istim uvjerenjem: ono što većina ne primijeti na prvi pogled čini razliku.',
    ],
  },
  {
    src: vrancic,
    alt: 'Homo volans, crtež padobrana Fausta Vrančića iz knjige Machinae novae',
    ime: 'Faust Vrančić',
    godine: '1551.–1617.',
    uloga: 'Izumitelj i jezikoslovac',
    tekst:
      'Šibenčanin koji je u knjizi Machinae novae nacrtao Homo volans, letećeg čovjeka pod padobranom, jedan od najranijih nacrta padobrana. Napisao je i rječnik pet najuglednijih europskih jezika.',
    misao: [
      'Svaka ideja počinje nacrtom.',
      'Tako počinje i izrada web stranice: prije prvog retka koda slažem jasan plan onoga što Vaši kupci trebaju vidjeti.',
    ],
  },
  {
    src: supuk,
    alt: 'Portret Ante Šupuka, gradonačelnika Šibenika',
    ime: 'Ante Šupuk',
    godine: '1838.–1904.',
    uloga: 'Gradonačelnik koji je upalio svjetlo',
    tekst:
      'Zahvaljujući njemu Šibenik je 1895. među prvim gradovima na svijetu dobio javnu rasvjetu na izmjeničnu struju, iz hidroelektrane Jaruga na Krki.',
    misao: [
      'Šibenik je bio vidljiv prije drugih.',
      'Neka i Vaš posao bude vidljiv. Web stranica i lokalni SEO u Šibeniku služe upravo tome: da Vas kupci pronađu na Googleu.',
    ],
  },
  {
    src: petrovic,
    alt: 'Dražen Petrović u dresu Šibenke s brojem 4, s loptom na terenu',
    ime: 'Dražen Petrović',
    godine: '1964.–1993.',
    uloga: 'Košarkaški genij iz Šibenika',
    tekst:
      'Iz šibenske dvorane, u dresu Šibenke, stigao je do NBA lige i Kuće slavnih. Dokaz da talent i rad iz Šibenika mogu stići do cijelog svijeta.',
    misao: [
      'Iz Šibenika do svijeta.',
      'Radim s obrtnicima i malim firmama iz Šibenika i cijele Hrvatske. Dobra stranica vodi Vaš posao dalje od Vaše ulice.',
    ],
  },
];

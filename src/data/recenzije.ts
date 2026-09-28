// Recenzije klijenata. Upisujte samo prave recenzije, uz dopuštenje klijenta.
// Dok je popis prazan, sekcija s recenzijama se ne prikazuje.
export type Recenzija = { tekst: string; ime: string; posao: string; mjesto?: string };

export const recenzije: Recenzija[] = [];

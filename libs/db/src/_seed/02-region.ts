import { EnumValues } from '@app/shared';

// REGION IDs
export const ADDIS_ABABA = 1;
export const DIRE_DAWA = 2;
export const AFAR = 3;
export const AMHARA = 4;
export const BENISHANGUL_GUMUZ = 5;
export const GAMBELA = 6;
export const HARARI = 7;
export const OROMIA = 8;
export const SIDAMA = 9;
export const SOMALI = 10;
export const SNNPR = 11;
export const TIGRY = 12;

//-------- HELPERS ----
export const REGIONS = [
  ADDIS_ABABA,
  DIRE_DAWA,
  AFAR,
  AMHARA,
  BENISHANGUL_GUMUZ,
  GAMBELA,
  HARARI,
  OROMIA,
  SIDAMA,
  SOMALI,
  SNNPR,
  TIGRY,
] as const;

//-------- SEED -------
export const REGIONS_SEED = [
  { id: ADDIS_ABABA, name: 'Addis Ababa' },
  { id: DIRE_DAWA, name: 'Dire Dawa' },
  { id: AFAR, name: 'Afar' },
  { id: AMHARA, name: 'Amhara' },
  { id: BENISHANGUL_GUMUZ, name: 'Benishangul Gumuz' },
  { id: GAMBELA, name: 'Gambela' },
  { id: HARARI, name: 'Harari' },
  { id: OROMIA, name: 'Oromia' },
  { id: SIDAMA, name: 'Sidama' },
  { id: SOMALI, name: 'Somali' },
  { id: SNNPR, name: 'SNNPR' },
  { id: TIGRY, name: 'Tigray' },
];

export type Region = EnumValues<typeof REGIONS>;

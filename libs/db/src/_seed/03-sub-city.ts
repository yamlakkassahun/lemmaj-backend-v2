import { EnumValues } from '@app/shared';

// ADDIS ABABA SUB-CITY IDs
export const ARADA = 1;
export const ADDIS_KETEMA = 2;
export const AKAKI_KALITY = 3;
export const BOLE = 4;
export const GULLELE = 5;
export const KIRKOS = 6;
export const KOLFE_KERANIYO = 7;
export const LIDETA = 8;
export const NIFAS_SILK_LAFTO = 9;
export const YEKA = 10;
export const LEMIKURA = 11;

//-------- HELPERS ----
export const SUB_CITIES = [
  ARADA,
  ADDIS_KETEMA,
  AKAKI_KALITY,
  BOLE,
  GULLELE,
  KIRKOS,
  KOLFE_KERANIYO,
  LIDETA,
  NIFAS_SILK_LAFTO,
  YEKA,
  LEMIKURA,
] as const;

//-------- SEED -------
export const SUB_CITIES_SEED = [
  { id: ARADA, name: 'Arada' },
  { id: ADDIS_KETEMA, name: 'Addis Ketema' },
  { id: AKAKI_KALITY, name: 'Akaki Kality' },
  { id: BOLE, name: 'Bole' },
  { id: GULLELE, name: 'Gullele' },
  { id: KIRKOS, name: 'Kirkos' },
  { id: KOLFE_KERANIYO, name: 'Kolfe Keraniyo' },
  { id: LIDETA, name: 'Lideta' },
  { id: NIFAS_SILK_LAFTO, name: 'Nifas Silk Lafto' },
  { id: YEKA, name: 'Yeka' },
  { id: LEMIKURA, name: 'Lemi kura' },
];

export type SubCity = EnumValues<typeof SUB_CITIES>;

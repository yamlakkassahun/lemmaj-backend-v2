import { EnumValues } from '@app/shared';

//
// ADMIN realm
export const AUTO = 1;
export const HEAVY_ONE = 2;
export const HEAVY_TWO = 3;
export const SPACIAL = 4;

//-------- HELPERS ----
export const LICENSE_TYPE = [AUTO, HEAVY_ONE, HEAVY_TWO, SPACIAL] as const;

//-------- SEED -------
export const LICENSE_TYPE_SEED = [
  // administrative
  { id: AUTO, name: 'AUTO', description: 'Auto for private cars' },
  {
    id: HEAVY_ONE,
    name: 'HEAVY_ONE',
    description: 'Heavy One for minibus and small pick ups',
  },
  {
    id: HEAVY_TWO,
    name: 'HEAVY_TWO',
    description: 'Heavy Two for large bus and large pick ups',
  },
  {
    id: SPACIAL,
    name: 'SPACIAL',
    description: 'Spacial for contraction vehicles',
  },
];

export type License_Type = EnumValues<typeof LICENSE_TYPE>;

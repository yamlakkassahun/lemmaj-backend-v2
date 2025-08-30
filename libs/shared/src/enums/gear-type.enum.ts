type EnumValues<T> = T[keyof T];

export const GEAR_TYPE = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  BOTH: 'BOTH',
} as const;
export type GearTypeEnum = EnumValues<typeof GEAR_TYPE>;

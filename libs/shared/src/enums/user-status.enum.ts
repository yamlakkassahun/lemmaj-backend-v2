type EnumValues<T> = T[keyof T];

export const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  SUSPENDED: 'SUSPENDED',
} as const;
export type UserStatus = EnumValues<typeof USER_STATUS>;

export const GENDER_ENUM = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;
export type GenderEnum = EnumValues<typeof GENDER_ENUM>;

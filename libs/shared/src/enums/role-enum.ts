// export enum Role {
//   USER = 'user',
//   SUPER = 'super',
//   ADMIN = 'admin',
// }

import { EnumValues } from './enum-type';

export const ADMIN = 1;
export const STUDENT = 2;
export const INSTRUCTOR = 3;
export const FINANCE = 4;

//-------- HELPERS ----
export const ROLE = [ADMIN, STUDENT, INSTRUCTOR, FINANCE] as const;
export type UserRole = EnumValues<typeof ROLE>;

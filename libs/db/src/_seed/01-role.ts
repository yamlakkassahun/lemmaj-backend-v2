import {
  ADMIN,
  EnumValues,
  FINANCE,
  INSTRUCTOR,
  ROLE,
  STUDENT,
} from '@app/shared';

//-------- SEED -------
export const ROLES_SEED = [
  // administrative
  { id: ADMIN, name: 'ADMIN', description: 'System Admin' },
  { id: STUDENT, name: 'STUDENT', description: 'Student' },
  { id: INSTRUCTOR, name: 'INSTRUCTOR', description: 'Instructor' },
  { id: FINANCE, name: 'FINANCE', description: 'Finance' },
];

export type Role = EnumValues<typeof ROLE>;

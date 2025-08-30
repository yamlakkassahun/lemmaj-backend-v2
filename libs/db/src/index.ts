import { LESSON_MATERIAL_ENTITY } from './lesson-material';
import { PARAMETER_ENTITY } from './parameters';
import { USER_ENTITY } from './user';

export * from './user';
export * from './_seed';
export * from './parameters';
export * from './lesson-material';

export const ENTITIES = [
  ...USER_ENTITY,
  ...PARAMETER_ENTITY,
  ...LESSON_MATERIAL_ENTITY,
];

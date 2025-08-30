type EnumValues<T> = T[keyof T];

export const LESSON_STATUS = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type LessonStatusEnum = EnumValues<typeof LESSON_STATUS>;

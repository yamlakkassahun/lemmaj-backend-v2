import { CourseEntity } from './course.entity';
import { DutyDateEntity } from './due-date.entity';
import { LessonEntity } from './lesson.entity';
import { PackageEntity } from './package.entity';
import { ScheduleEntity } from './schedule.entity';
import { VehicleEntity } from './vehicle.entity';
import { ReviewEntity } from './review.entity';
import { LeaveEntity } from './lleave.entity';

export * from './course.entity';
export * from './package.entity';
export * from './lesson.entity';
export * from './due-date.entity';
export * from './schedule.entity';
export * from './vehicle.entity';
export * from './review.entity';
export * from './lleave.entity';

export const LESSON_MATERIAL_ENTITY = [
  CourseEntity,
  PackageEntity,
  LessonEntity,
  DutyDateEntity,
  ScheduleEntity,
  VehicleEntity,
  ReviewEntity,
  LeaveEntity
];

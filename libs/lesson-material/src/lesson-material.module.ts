import { Module } from '@nestjs/common';
import {
  CourseController,
  DutyDateController,
  LessonController,
  PackageController,
  ReviewController,
  ScheduleController,
} from './controllers';
import {
  CourseService,
  DutyDateService,
  LessonService,
  PackageService,
  ReviewService,
  ScheduleService,
} from './services';
import { ParametersModule } from '@app/parameters';

const controllers = [
  PackageController,
  CourseController,
  LessonController,
  ReviewController,
  DutyDateController,
  ScheduleController,
];
const providers = [
  CourseService,
  PackageService,
  LessonService,
  DutyDateService,
  ScheduleService,
  ReviewService,
];

@Module({
  imports: [ParametersModule],
  controllers,
  providers,
  exports: providers,
})
export class LessonMaterialModule { }

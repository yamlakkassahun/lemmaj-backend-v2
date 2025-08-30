import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LESSON_STATUS, LessonStatusEnum } from '@app/shared';
import { LessonEntity } from '@app/db';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: 'Student user ID' })
  @IsNumber()
  @Type(() => Number)
  studentId: number;

  @ApiProperty({ example: 2, description: 'Package ID' })
  @IsNumber()
  packageId: number;

  @ApiProperty({ example: 3, description: 'Instructor user ID (optional)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  instructorId?: number;

  @ApiProperty({ enum: LESSON_STATUS, default: LESSON_STATUS.PENDING })
  @IsEnum(LESSON_STATUS)
  status: LessonStatusEnum;
}

export class SelectInstructorDto {
  @ApiProperty({ example: 3, description: 'Instructor user ID' })
  @IsNumber()
  @Type(() => Number)
  instructorId: number;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

export const lessonPageConfig: PaginateConfig<LessonEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'package.name',
    'student.userProfile.firstName',
    'student.userProfile.lastName',
    'instructor.userProfile.firstName',
    'instructor.userProfile.lastName',
  ],
  select: [
    'id',
    'instructorId',
    'student.id',
    'student.phone',
    'student.email',
    'student.userProfile.id',
    'student.userProfile.firstName',
    'student.userProfile.lastName',
    'student.userProfile.nationalId',
    // 'student.userProfile.birthOfDate',
    'student.userProfile.gender',
    'instructor.id',
    'instructor.userProfile.id',
    'instructor.userProfile.firstName',
    'instructor.userProfile.lastName',
    'package.id',
    'package.name',
    'package.courses.id',
    'status',
    'duration',
    'price',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    'instructor.id': [FilterOperator.EQ],
    'student.id': [FilterOperator.EQ],
    'student.userProfile.firstName': [FilterOperator.ILIKE],
  },
  relations: [
    'package',
    'package.courses',
    'instructor.userProfile',
    'student.userProfile',
  ],
};

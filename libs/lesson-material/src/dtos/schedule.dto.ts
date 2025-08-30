import { ScheduleEntity } from '@app/db';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsDateString, IsNotEmpty, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class TimeRangeDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}

export class CreateScheduleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  instructorId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  dutyDateId?: number;

  @ApiProperty({
    enum: ['BOOKED', 'DONE', 'PENDING', 'SCHEDULED', 'APPROVED', 'COMPLETED'],
  })
  @IsEnum(['BOOKED', 'DONE', 'PENDING', 'SCHEDULED', 'APPROVED', 'COMPLETED'])
  status: string;

  @ValidateNested()
  @Type(() => TimeRangeDto)
  instractorTime: TimeRangeDto;

  @ValidateNested()
  @Type(() => TimeRangeDto)
  studentTime: TimeRangeDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  vehicleId?: number;
}


class TimeMetaDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  startTime?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  hasStarted?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  hasEnded?: boolean;
}

export class UpdateScheduleTimeDto {
  @IsNumber()
  @ApiProperty({ required: true })
  scheduleId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => TimeMetaDto)
  @ApiProperty({ type: TimeMetaDto, required: false })
  instractorTime?: TimeMetaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TimeMetaDto)
  @ApiProperty({ type: TimeMetaDto, required: false })
  studentTime?: TimeMetaDto;
}

export class UpdateScheduleDto extends CreateScheduleDto { }

export const schedulePageConfig: PaginateConfig<ScheduleEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'ASC']],
  searchableColumns: ['lesson.package.name'],
  select: [
    'id',
    'courses',
    'lesson.id',
    'lesson.package.id',
    'lesson.package.name',
    'student.id',
    'student.userProfile.id',
    'student.userProfile.firstName',
    'student.userProfile.lastName',
    'instructor.id',
    'instructor.userProfile.id',
    'instructor.userProfile.firstName',
    'instructor.userProfile.lastName',
    'date',
    'status',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
    'lesson.id': [FilterOperator.EQ],
    'student.id': [FilterOperator.EQ],
    'instructor.id': [FilterOperator.EQ],
  },
  relations: [
    'lesson',
    'lesson.package',
    'student',
    'student.userProfile',
    'instructor',
    'instructor.userProfile',
  ],
};

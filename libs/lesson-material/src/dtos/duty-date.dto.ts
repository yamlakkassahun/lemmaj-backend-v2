import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DutyDateEntity } from '@app/db';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Optional } from '@nestjs/common';

export class CreateDutyDateDto {
  @ApiProperty({
    description: 'Date of the duty schedule (YYYY-MM-DD)',
    example: '2025-07-01',
    type: String,
    format: 'date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'id of the instructor user',
    example: 4,
  })
  @IsNumber()
  @Type(() => Number)
  instructorId: string;

  @ApiProperty({
    description: 'Start time of the duty (24h format)',
    example: '08:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the duty (24h format)',
    example: '12:00',
  })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({
    description: 'Status of the duty',
    enum: ['Scheduled', 'Available', 'OnLive', 'Completed'],
    default: 'Available',
  })
  @IsOptional()
  @IsEnum(['Scheduled', 'Available', 'OnLive', 'Completed'])
  status?: string;
}

export class UpdateDutyDateDto extends PartialType(CreateDutyDateDto) { }


export class GenerateDutyDatesDto {
  @IsNumber()
  @Optional()
  instructorId?: number;

  @IsDateString()
  @ApiProperty({
    description: 'Start date of the duty schedule (YYYY-MM-DD)',
    example: '2025-07-01',
    type: String,
    format: 'date',
  })
  startDate: string; // e.g. "2025-09-15"

  @IsDateString()
  @ApiProperty({
    description: 'End date of the duty schedule (YYYY-MM-DD)',
    example: '2025-12-15',
    type: String,
    format: 'date',
  })
  endDate: string; // e.g. "2025-12-15"

  @IsString()
  @ApiProperty({
    description: 'Start time of the duty (24h format)',
    example: '09:00',
  })
  startTime: string; // e.g. "09:00"

  @IsString()
  @ApiProperty({
    description: 'End time of the duty (24h format)',
    example: '17:00',
  })
  endTime: string; // e.g. "17:00"

  @IsEnum(['Scheduled', 'Available', 'OnLive', 'Completed'])
  @ApiProperty({})
  status: 'Scheduled' | 'Available' | 'OnLive' | 'Completed';

  @IsEnum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  @ApiProperty({})
  weekday: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
}






export const dutyDatePageConfig: PaginateConfig<DutyDateEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['instructor.userProfile.firstName'],
  select: [
    'id',
    'date',
    'instructor.id',
    'instructor.userProfile.id',
    'instructor.userProfile.firstName',
    'instructor.userProfile.lastName',
    'startTime',
    'endTime',
    'status',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    'instructor.id': [FilterOperator.EQ],
    date: [FilterOperator.GT],
    status: [FilterOperator.EQ],
  },
  relations: ['instructor', 'instructor.userProfile'],
};

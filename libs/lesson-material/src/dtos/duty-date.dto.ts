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

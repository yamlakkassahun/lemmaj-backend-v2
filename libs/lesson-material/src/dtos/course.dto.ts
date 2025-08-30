import { CourseEntity } from '@app/db';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Beginner JavaScript',
    description: 'Display label of the course',
  })
  @IsString()
  label: string;

  @ApiProperty({
    example: 'js_beginner',
    description: 'Unique internal value used for course reference',
  })
  @IsString()
  value: string;

  @ApiProperty({
    example: 30,
    description: 'Length of the course in hours',
  })
  @IsNumber()
  length: number;

  @ApiPropertyOptional({
    example: 'An introductory course on JavaScript fundamentals',
    description: 'Optional course description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export const coursePageConfig: PaginateConfig<CourseEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['label'],
  select: [
    'id',
    'label',
    'value',
    'length',
    'description',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    label: [FilterOperator.ILIKE],
  },
  relations: [],
};

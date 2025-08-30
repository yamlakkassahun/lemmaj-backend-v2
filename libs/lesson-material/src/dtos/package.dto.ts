import { PackageEntity } from '@app/db';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export class CreatePackageDto {
  @ApiProperty({
    example: 'Frontend Developer Package',
    description: 'Name of the package',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example:
      'Covers all essential frontend technologies like HTML, CSS, JS, React',
    description: 'Optional description of the package',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'PKG-FE-101',
    description: 'Unique package code used for tracking or reference',
  })
  @IsString()
  packageCode: string;

  @ApiPropertyOptional({
    example: 1500,
    description: 'Total price for the package in ETB',
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of course IDs included in the package',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  courses: number[];
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) { }

export const packagePageConfig: PaginateConfig<PackageEntity> = {
  sortableColumns: ['id'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name'],
  select: [
    'id',
    'name',
    'price',
    'duration',
    'packageCode',
    'description',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
  },
  relations: [],
};

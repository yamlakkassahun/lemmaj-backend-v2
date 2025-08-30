import { VehicleEntity } from '@app/db';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  type: string; // manual / automatic / motorbike

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '2025-01-01',
    required: false,
    type: String,
    format: 'date',
  })
  model: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

export const vehiclePageConfig: PaginateConfig<VehicleEntity> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name'],
  select: [
    'id',
    'name',
    'type',
    'model',
    'remarks',
    'isActive',
    'createdAt',
    'updatedAt',
    'isAvailable',
    'plateNumber',
  ],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
  },
  relations: [],
};

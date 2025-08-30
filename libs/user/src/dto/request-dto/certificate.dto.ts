import { CertificateEntity } from '@app/db';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export const certificatePageConfig: PaginateConfig<CertificateEntity> = {
  sortableColumns: ['id', 'title', 'description'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description'],
  select: [
    'id',
    'title',
    'description',
    'issuedDate',
    'imageUrls',
    'userId',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    userId: [FilterOperator.EQ],
  },
  relations: ['user'],
};

export class CreateCertificateDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the role assigned to the admin',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '2024-01-01',
    required: false,
    type: String,
    format: 'date',
  })
  issuedDate?: Date;

  @ApiPropertyOptional({
    example: 'images/uploads/profile.jpg',
    description: 'Certificate picture path or URL',
  })
  @IsString()
  @IsOptional()
  imageUrls?: string;
}

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}

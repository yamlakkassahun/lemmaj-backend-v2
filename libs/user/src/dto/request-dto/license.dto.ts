
import { LicenseEntity } from "@app/db";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber } from "class-validator";
import { PaginateConfig, FilterOperator } from "nestjs-paginate";

export const licensePageConfig: PaginateConfig<LicenseEntity> = {
    sortableColumns: ['id', 'licenseName', 'registrationNo'],
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['licenseName', 'registrationNo', 'user.userProfile.firstName'],
    select: [
        'id',
        'licenseName',
        'licensePic',
        'licenseBackPic',
        'registrationNo',
        'issuedDate',
        'user.id',
        'user.userProfile.id',
        'user.userProfile.firstName',
        'user.userProfile.lastName',
        'expiredDate',
        'createdAt',
        'updatedAt',
    ],
    filterableColumns: {
        userId: [FilterOperator.EQ],
    },
    relations: ['user', 'user.userProfile'],
};


export class CreateLicenseDto {
    @ApiProperty({ description: 'Name of the license' })
    @IsString()
    @IsNotEmpty()
    licenseName: string;

    @ApiPropertyOptional({ description: 'Front picture of the license (URL or path)' })
    @IsString()
    @IsOptional()
    licensePic?: string;

    @ApiPropertyOptional({ description: 'Back picture of the license (URL or path)' })
    @IsString()
    @IsOptional()
    licenseBackPic?: string;

    @ApiPropertyOptional({ description: 'License registration number' })
    @IsString()
    @IsOptional()
    registrationNo?: string;

    @ApiPropertyOptional({ description: 'License issued date', example: '2025-09-28' })
    @IsDateString()
    @IsOptional()
    issuedDate?: Date;

    @ApiPropertyOptional({ description: 'License expiry date', example: '2026-09-28' })
    @IsDateString()
    @IsOptional()
    expiredDate?: Date;

    @ApiProperty({ description: 'Associated user ID' })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    userId: number;
}


export class UpdateLicenseDto extends PartialType(CreateLicenseDto) { }
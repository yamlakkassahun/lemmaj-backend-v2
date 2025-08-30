import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from '@app/db';
import { PaginateConfig, FilterOperator } from 'nestjs-paginate';
import { GEAR_TYPE, GearTypeEnum, GENDER_ENUM, GenderEnum } from '@app/shared';

export const userPageConfig: PaginateConfig<UserEntity> = {
  sortableColumns: [
    'id',
    'userProfile.firstName',
    'userProfile.lastName',
    'email',
  ],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'userProfile.firstName',
    'userProfile.lastName',
    'email',
    'phone',
  ],
  select: [
    'id',
    'email',
    'phone',
    'roleId',
    'status',
    'role.id',
    'role.name',
    'userProfile.id',
    'userProfile.firstName',
    'userProfile.lastName',
    'userProfile.nationalId',
    'userProfile.profilePic',
    'userProfile.dateOfBirth',
    'userProfile.gender',
    'userProfile.country',
    'userProfile.region.id',
    'userProfile.region.name',
    'userProfile.city',
    'userProfile.subCity.id',
    'userProfile.subCity.name',
    'userProfile.worda',
    'userProfile.trainingArea',
    'createdAt',
    'updatedAt',
  ],
  filterableColumns: {
    first_name: [FilterOperator.ILIKE],
    email: [FilterOperator.ILIKE],
    roleId: [FilterOperator.EQ],
    status: [FilterOperator.EQ],
  },
  relations: [
    'role',
    'userProfile',
    'userProfile.region',
    'userProfile.subCity',
  ],
};

export class RegisterAdminDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the admin',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, {
    message:
      'First name is too short. At least, it should be $constraint1 characters, but actual is $value',
  })
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the admin',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Phone number of the admin',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile picture URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  @ApiProperty({
    example: 2,
    description: 'ID of the role assigned to the admin',
  })
  @IsNumber()
  @Type(() => Number)
  roleId: number;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for the admin user',
  })
  @IsString()
  password: string;
}

export class RegisterStudentDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the admin',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, {
    message:
      'First name is too short. At least, it should be $constraint1 characters, but actual is $value',
  })
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the admin',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Phone number of the admin',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile picture URL',
  })
  @IsObject()
  @IsOptional()
  profilePic?: string;

  @ApiPropertyOptional({
    example: 'My name is .....',
    description: 'Simple introduction',
  })
  @IsString()
  @IsOptional()
  bio?: string;


  @ApiProperty({
    example: 3,
    description: 'ID of the role assigned to the admin',
  })
  @IsNumber()
  @Type(() => Number)
  roleId: number;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password for the admin user',
  })
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'ABC-1234', required: false })
  nationalId?: string;

  @ApiPropertyOptional({
    example: '1995-06-15',
    description: 'Date of birth in ISO format',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    enum: GENDER_ENUM,
    description: 'Gender',
    default: GENDER_ENUM.MALE,
  })
  @IsEnum(GENDER_ENUM)
  gender: GenderEnum;

  @ApiProperty({
    enum: GEAR_TYPE,
    description: 'Gear Type',
    default: GEAR_TYPE.BOTH,
  })
  @IsEnum(GEAR_TYPE)
  gearType: GearTypeEnum;

  @ApiPropertyOptional({
    example: 'Ethiopia',
    description: 'Country of residence',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 1, description: 'Region ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  regionId?: number;

  @ApiPropertyOptional({ example: 'Addis Ababa', description: 'City name' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 2, description: 'Sub-city ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  subCityId?: number;

  @ApiPropertyOptional({
    example: '04',
    description: 'Worda (district) number or name',
  })
  @IsOptional()
  @IsString()
  worda?: string;

  @ApiPropertyOptional({
    example: 'Plumbing',
    description: 'Area of training or specialization',
  })
  @IsOptional()
  @IsString()
  trainingArea?: string;

  // register
  @IsObject()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/license.jpg', required: false })
  licensePic?: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/license.jpg', required: false })
  licenseBackPic?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 3, required: false })
  @Type(() => Number)
  licenseTypeId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 1234, required: false })
  @Type(() => Number)
  registrationNo?: number;

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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '2025-01-01',
    required: false,
    type: String,
    format: 'date',
  })
  expiredDate?: Date;
}

// "nationalId": null,
// "dateOfBirth": null,

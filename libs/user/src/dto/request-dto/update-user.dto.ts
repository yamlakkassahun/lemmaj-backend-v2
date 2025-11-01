/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserEntity } from '@app/db';
import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { existsSync, unlinkSync } from 'fs';
import {
  GEAR_TYPE,
  GearTypeEnum,
  GENDER_ENUM,
  GenderEnum,
  ObjectUtil,
  USER_STATUS,
  UserStatus,
} from '@app/shared';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3, {
    message:
      'first Name is too short. At least, it should be $constraint1 characters, but actual is $value',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  macAddress?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profilePic?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  companyId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  roleId?: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'])
  status?: UserStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;
}

export class UpdateAdminDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the admin',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(2, {
    message:
      'First name is too short. At least, it should be $constraint1 characters, but actual is $value',
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the admin',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Last name of the admin',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Phone number of the admin',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile picture URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;


  @ApiPropertyOptional({
    example: 'https://example.com/images/profile.jpg',
    description: 'Profile picture URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: 3,
    description: 'ID of the role assigned to the admin',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

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
  @IsNotEmpty()
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty({
    enum: GEAR_TYPE,
    description: 'Gear Type',
    default: GEAR_TYPE.BOTH,
  })
  @IsEnum(GEAR_TYPE)
  @IsNotEmpty()
  @IsOptional()
  gearType?: GearTypeEnum;

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
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/license.jpg', required: false })
  licensePic?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/license.jpg', required: false })
  licenseBackPic?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 3, required: false })
  licenseTypeId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ example: 'ABC-1234', required: false })
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

  @ApiProperty({
    enum: USER_STATUS,
    description: 'Gear Type',
    default: USER_STATUS.PENDING,
  })
  @IsEnum(USER_STATUS)
  @IsNotEmpty()
  @IsOptional()
  status?: UserStatus;
}

export class UpdateAdminPayload {
  private _userId: number;
  private _user: UserEntity;
  private _oldProfilePic?: string;

  // Profile info
  private _firstName?: string;
  private _middleName?: string;
  private _lastName?: string;
  private _phone?: string;
  private _profilePic?: string;
  private _roleId?: number;
  private _email?: string;
  private _status?: UserStatus;

  // Customer profile
  private _nationalId?: string;
  private _dateOfBirth?: string;
  private _gender?: string;
  private _gearType?: string;
  private _country?: string;
  private _regionId?: number;
  private _city?: string;
  private _subCityId?: number;
  private _worda?: string;
  private _bio?: string;
  private _trainingArea?: string;

  // laicense profile
  private _licensePic?: string;
  private _licenseBackPic?: string;
  private _licenseTypeId?: number;
  private _registrationNo?: number;
  private _issuedDate?: Date;
  private _expiredDate?: Date;

  constructor(dto: UpdateAdminDto, userId: number) {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      roleId,
      email,
      profilePic,
      dateOfBirth,
      gender,
      gearType,
      country,
      regionId,
      city,
      bio,
      subCityId,
      worda,
      trainingArea,
      nationalId,
      licensePic,
      licenseBackPic,
      licenseTypeId,
      registrationNo,
      issuedDate,
      expiredDate,
      status,
    } = dto;

    this._userId = userId;
    this._firstName = firstName ? firstName : undefined;
    this._middleName = middleName ? middleName : undefined;
    this._lastName = lastName ? lastName : undefined;

    this._phone = phone ? phone.trim() : undefined;
    this._roleId = roleId;
    this._email = email?.trim();
    this._profilePic = profilePic;
    this._dateOfBirth = dateOfBirth;
    this._gender = gender;
    this._gearType = gearType;
    this._country = country;
    this._regionId = regionId;
    this._bio = bio;
    this._city = city;
    this._subCityId = subCityId;
    this._worda = worda;
    this._trainingArea = trainingArea;
    this._nationalId = nationalId;
    this._licensePic = licensePic;
    this._licenseBackPic = licenseBackPic;
    this._licenseTypeId = licenseTypeId;
    this._registrationNo = registrationNo;
    this._issuedDate = issuedDate;
    this._expiredDate = expiredDate;
    this._status = status;
  }

  private isValidUserStatus(): void {
    if (this._user.status === 'SUSPENDED') {
      throw new BadRequestException('Account is disabled or suspended');
    }
  }

  private handleProfilePicUpdate(): void {
    if (
      this._user.userProfile.profilePic &&
      this._profilePic &&
      existsSync(this._user.userProfile.profilePic)
    ) {
      this._oldProfilePic = this._user.userProfile.profilePic;
    }
  }

  public getUpdatePayload(): Partial<UserEntity> {
    return ObjectUtil.pruneNullAndUndefined({
      id: +this._userId,
      phone: this._phone,
      email: this._email,
      role: {
        id: this._roleId,
      },
      userProfile: {
        firstName: this._firstName,
        middleName: this._middleName,
        lastName: this._lastName,
        profilePic: this._profilePic,
        nationalId: this._nationalId,
        dateOfBirth: this._dateOfBirth,
        gender: this._gender,
        gearType: this._gearType,
        country: this._country,
        regionId: this._regionId,
        city: this._city,
        subCityId: this._subCityId,
        worda: this._worda,
        bio: this._bio,
        trainingArea: this._trainingArea,
      },
      licenseProfile: {
        licensePic: this._licensePic,
        licenseBackPic: this._licenseBackPic,
        licenseType: { id: this._licenseTypeId },
        registrationNo: this._registrationNo,
        gearType: this._gearType,
        issuedDate: this._issuedDate,
        expiredDate: this._expiredDate,
      },
      status: this._status,
    });
  }

  public validateUpdate(
    user: UserEntity,
    isPhoneUsed: boolean | undefined,
    isEmailUsed: boolean | undefined,
  ): void {
    this._user = user;
    this.isValidUserStatus();
    this.handleProfilePicUpdate();

    if (isPhoneUsed) {
      throw new BadRequestException(
        `Phone number ${this._phone} is already used`,
      );
    }
    if (isEmailUsed) {
      throw new BadRequestException(`Email ${this._email} is already used`);
    }
  }

  public deleteOldProfilePic(): void {
    if (this._oldProfilePic && existsSync(this._oldProfilePic)) {
      unlinkSync(this._oldProfilePic);
    }
  }
}

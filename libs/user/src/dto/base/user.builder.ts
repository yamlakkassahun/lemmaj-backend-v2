import { LicenseProfileEntity, UserEntity, UserProfileEntity } from '@app/db';
import { GearTypeEnum, GenderEnum, UserStatus } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { capitalizeWords } from 'node-string-utils';
import * as bcrypt from 'bcrypt';

export class UserBuilder {
  private user: UserEntity;

  constructor() {
    this.user = new UserEntity({
      status: 'PENDING',
      userProfile: new UserProfileEntity({}),
      licenseProfile: new LicenseProfileEntity({}),
    });
  }

  // user fields
  setPhone(phone: string): this {
    this.user.phone = phone.trim();
    return this;
  }

  setEmail(value: string): this {
    this.user.email = value;
    return this;
  }

  setPassword(value: string): this {
    this.user.password = bcrypt.hashSync(value, 10);
    return this;
  }

  setRole(value: number): this {
    this.user.roleId = value;
    return this;
  }

  setStatus(value: UserStatus): this {
    this.user.status = value;
    return this;
  }

  // user profile
  setFirstName(value: string): this {
    this.user.userProfile.firstName = capitalizeWords(value);
    return this;
  }

  setLastName(value: string): this {
    this.user.userProfile.lastName = capitalizeWords(value);
    return this;
  }

  setBio(value?: string): this {
    this.user.userProfile.bio = value;
    return this;
  }

  setNationalId(value: string): this {
    this.user.userProfile.nationalId = value;
    return this;
  }

  setProfilePic(value?: string): this {
    this.user.userProfile.profilePic = value;
    return this;
  }

  setDateOfBirth(value?: Date): this {
    this.user.userProfile.dateOfBirth = value;
    return this;
  }

  setGender(value: GenderEnum): this {
    this.user.userProfile.gender = value;
    return this;
  }

  setCountry(value?: string): this {
    this.user.userProfile.country = value;
    return this;
  }

  setRegionId(value?: number): this {
    this.user.userProfile.regionId = value;
    return this;
  }

  setCity(value?: string): this {
    this.user.userProfile.city = value;
    return this;
  }

  setSubCityId(value?: number): this {
    this.user.userProfile.subCityId = value;
    return this;
  }

  setWorda(value?: string): this {
    this.user.userProfile.worda = value;
    return this;
  }

  setTrainingArea(value: string): this {
    this.user.userProfile.trainingArea = value;
    return this;
  }

  // license profile
  setLicenseProfile(value: any) {
    this.user.licenseProfile = value;
  }

  private get licenseProfile(): LicenseProfileEntity {
    if (!this.user.licenseProfile) {
      this.user.licenseProfile = new LicenseProfileEntity({});
    }
    return this.user.licenseProfile;
  }

  setGearType(value: GearTypeEnum): this {
    this.licenseProfile.gearType = value;
    return this;
  }

  setLicensePic(value: string): this {
    this.licenseProfile.licensePic = value;
    return this;
  }

  setLicenseBackPic(value: string): this {
    this.licenseProfile.licenseBackPic = value;
    return this;
  }

  setLicenseTypeId(value: number): this {
    this.licenseProfile.licenseTypeId = value ?? null;
    return this;
  }

  setRegistrationNo(value: string): this {
    this.licenseProfile.registrationNo = value ?? null;
    return this;
  }

  setIssuedDate(value?: Date): this {
    if (value) {
      this.licenseProfile.issuedDate = value;
    }
    return this;
  }

  setExpiredDate(value?: Date): this {
    if (value) {
      this.licenseProfile.expiredDate = value;
    }
    return this;
  }

  build(): UserEntity {
    const { phone, email } = this.user;
    if (!phone && !email) {
      throw new BadRequestException(
        `Registration requires a valid phone or email`,
      );
    }
    return this.user;
  }
}

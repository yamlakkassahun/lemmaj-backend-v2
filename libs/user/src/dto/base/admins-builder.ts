import { UserEntity } from '@app/db';
import { RegisterAdminDto, RegisterStudentDto } from '../request-dto';
import { IUserBuilder } from '../interfaces';
import { UserBuilder } from './user.builder';

export class AdministrativeUserBuilder implements IUserBuilder {
  private dto: RegisterAdminDto;
  private builder: UserBuilder;
  constructor(dto: RegisterAdminDto) {
    this.dto = dto;
    this.builder = new UserBuilder();
  }

  async getUser(): Promise<UserEntity> {
    const { firstName, lastName, phone, email, profilePic, roleId, password } =
      this.dto;
    this.builder = this.builder
      .setFirstName(firstName)
      .setLastName(lastName)
      .setPhone(phone)
      .setEmail(email)
      .setRole(roleId)
      .setPassword(password)
      .setProfilePic(profilePic);

    return this.builder.build();
  }
}

export class StudentBuilder implements IUserBuilder {
  private dto: RegisterStudentDto;
  private builder: UserBuilder;
  constructor(dto: RegisterStudentDto) {
    this.dto = dto;
    this.builder = new UserBuilder();
  }

  async getUser(): Promise<UserEntity> {
    const {
      firstName,
      lastName,
      phone,
      email,
      profilePic,
      roleId,
      nationalId,
      password,
      bio,
      licensePic,
      licenseBackPic,
      licenseTypeId,
      registrationNo,
      issuedDate,
      expiredDate,
      country,
      regionId,
      city,
      dateOfBirth,
      subCityId,
      worda,
      gender,
      gearType,
      trainingArea,
    } = this.dto;
    this.builder = this.builder
      .setFirstName(firstName)
      .setLastName(lastName)
      .setPhone(phone)
      .setEmail(email)
      .setRole(roleId)
      .setPassword(password)
      .setNationalId(nationalId ?? '')
      .setDateOfBirth(dateOfBirth ? new Date(dateOfBirth) : undefined)
      .setProfilePic(profilePic)
      .setLicensePic(licensePic ?? '')
      .setLicenseBackPic(licenseBackPic ?? '')
      .setLicenseTypeId(licenseTypeId ?? 1)
      .setRegistrationNo(registrationNo ? String(registrationNo) : '1')
      .setCountry(country)
      .setGender(gender)
      .setBio(bio)
      .setGearType(gearType)
      .setRegionId(regionId)
      .setCity(city)
      .setSubCityId(subCityId)
      .setWorda(worda)
      .setTrainingArea(trainingArea ?? '')
      .setIssuedDate(issuedDate)
      .setExpiredDate(expiredDate);

    return this.builder.build();
  }
}

// export class AdministrativeCustomerUserBuilder implements IUserBuilder {
//   private dto: RegisterCustomerStaffDto;
//   private builder: UserBuilder;
//   constructor(dto: RegisterCustomerStaffDto, requestInfo: IRequestDetail) {
//     this.dto = dto;
//     this.builder = new UserBuilder(requestInfo);
//   }

//   async getUser(): Promise<UserEntity> {
//     const { firstName, middleName, lastName, phone, email, profilePic, roleId, companyId } = this.dto;
//     this.builder = this.builder
//       .setFirstName(firstName)
//       .setMiddleName(middleName)
//       .setLastName(lastName)
//       .setPartnerId(companyId)
//       .setRealm('CUSTOMER')
//       .setPhone(phone)
//       .setEmail(email)
//       .setRole(roleId)
//       .setProfilePic(profilePic);
//     this.builder = await this.builder.addUserAccesses(['WEB']);
//     return this.builder.build();
//   }
//   getNotificationDetail(userId: number, channel?: Channel) {
//     return this.builder.getNotificationDetail(userId, channel);
//   }
// }

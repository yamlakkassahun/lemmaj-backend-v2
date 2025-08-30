import { LicenseProfileEntity } from './license-profile';
import { RoleEntity } from './role.entity';
import { UserProfileEntity } from './user-profile.entity';
import { UserEntity } from './user.entity';
import { CertificateEntity } from './certificate.entity';

export * from './user.entity';
export * from './role.entity';
export * from './user-profile.entity';
export * from './license-profile';
export * from './certificate.entity';

export const USER_ENTITY = [
  UserEntity,
  UserProfileEntity,
  RoleEntity,
  LicenseProfileEntity,
  CertificateEntity,
];

import { Module } from '@nestjs/common';
import { UserController, CertificateController, LicenseController } from './controllers';
import {
  CertificateService,
  CommonUserService,
  GetUserService,
  LicenseService,
  UserService,
} from './services';

const controllers = [UserController, CertificateController, LicenseController];
const providers = [
  UserService,
  CommonUserService,
  GetUserService,
  CertificateService,
  LicenseService,
];

@Module({
  controllers,
  providers,
  exports: providers,
})
export class UserModule { }

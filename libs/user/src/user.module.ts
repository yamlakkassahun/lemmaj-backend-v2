import { Module } from '@nestjs/common';
import { UserController, CertificateController } from './controllers';
import {
  CertificateService,
  CommonUserService,
  GetUserService,
  UserService,
} from './services';

const controllers = [UserController, CertificateController];
const providers = [
  UserService,
  CommonUserService,
  GetUserService,
  CertificateService,
];

@Module({
  controllers,
  providers,
  exports: providers,
})
export class UserModule {}

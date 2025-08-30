import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService, TokenService } from './services';
import { JwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './guards';
import { UserModule } from '@app/user';

const controllers = [AuthController];
const providers = [AuthService, JwtStrategy, TokenService, AuthenticationGuard];

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers,
  providers,
  exports: providers,
})
export class AuthModule {}

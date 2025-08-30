import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../services';
import { PUBLIC_ENDPOINT } from '@app/shared';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic =
      this.reflector.get(PUBLIC_ENDPOINT, context.getHandler()) ||
      this.reflector.get(PUBLIC_ENDPOINT, context.getClass());

    if (isPublic) return true;

    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const user = await this.tokenService.verifyAccessToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Blocked Account. Access Ristricted!');
    }

    // Role-based route access
    const requiredRoles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const hasPermission = !requiredRoles || requiredRoles.includes(user.roleId);

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden: insufficient role');
    }

    request.user = user;
    return true;
  }
}

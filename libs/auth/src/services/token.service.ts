import { UserEntity } from '@app/db';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPayload,
  TokensDto,
} from '../dto';
import { GetUserService } from '@app/user';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService,
  ) {}

  private issuer = 'lemmaj';

  private async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const privateKey = this.configService
      .get('AUTH_ACCESS_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');
    return this.jwtService.signAsync(payload, {
      privateKey,
      algorithm: 'ES256',
      keyid: 'access-key-1',
    });
  }

  private async signRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    const privateKey = this.configService
      .get('AUTH_REFRESH_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    return this.jwtService.signAsync(payload, {
      privateKey,
      algorithm: 'ES256',
      keyid: 'refresh-key-1',
    });
  }

  public async createTokenPair(
    user: UserEntity,
  ): Promise<TokensDto | undefined> {
    const NOW_SECONDS = Math.floor(Date.now() / 1000);

    const accessLifeSeconds = 60 * 60; // 5 minutes
    const refreshLifeSeconds = 60 * 60; // 1 hour

    const accessExp = NOW_SECONDS + accessLifeSeconds;
    const refreshExp = NOW_SECONDS + refreshLifeSeconds;

    const payload: TokenPayload = {
      role: user.role?.name,
      roleId: user.roleId,
      iat: NOW_SECONDS,
      typ: 'Bearer',
      iss: this.issuer,
      exp: accessExp,
      sub: user.id.toString(), // Usually user.id or user.uuid
    };

    const accessPayload: AccessTokenPayload = {
      ...payload,
      uname: '', // user?.userName,
      phone: user.phone,
      email: user.email,
      uid: user.id,
      cid: user?.userProfileId,
      status: user.status,
    };

    const refreshPayload: RefreshTokenPayload = {
      ...payload,
      typ: 'Refresh',
      exp: refreshExp,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(accessPayload),
      this.signRefreshToken(refreshPayload),
    ]);

    return { accessToken, refreshToken };
  }

  public async verifyAccessToken(
    accessToken: string,
  ): Promise<AccessTokenPayload | undefined> {
    try {
      if (!accessToken) {
        Logger.warn('No access token provided', TokenService.name);
        return;
      }

      const publicKey = this.configService
        .get('AUTH_ACCESS_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      if (!publicKey) {
        Logger.error('Public key not configured', TokenService.name);
        return;
      }

      const result = await this.jwtService.verifyAsync<AccessTokenPayload>(
        accessToken,
        {
          publicKey,
          algorithms: ['ES256'],
          ignoreExpiration: false,
        },
      );

      return result;
    } catch (error) {
      throw new BadGatewayException('verifyAccessToken failed', error);
    }
  }

  public async decodeRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload> {
    const refPayload: RefreshTokenPayload = await this.jwtService.decode(
      refreshToken,
      {
        json: true,
      },
    );

    return refPayload;
  }

  public async validRefreshToken(
    refreshToken: string,
  ): Promise<TokensDto | undefined> {
    try {
      if (!refreshToken) {
        throw new HttpException(
          'Refresh token not provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const publicKey = this.configService
        .get('AUTH_REFRESH_PUBLIC_KEY')
        ?.replace(/\\n/g, '\n');

      if (!publicKey) {
        throw new HttpException(
          'Refresh token public key is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 1. Verify the refresh token
      const refPayload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          publicKey,
          algorithms: ['ES256'],
        },
      );

      if (refPayload.typ !== 'Refresh') {
        throw new HttpException('Invalid token type', HttpStatus.UNAUTHORIZED);
      }

      // 2. Find the user by sub (usually user.idpId or userId)
      const user = await this.getUserService.getBy({ id: +refPayload?.sub });
      if (!user) {
        throw new HttpException(
          `User not found for the provided refresh token.`,
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 3. Issue new tokens
      Logger.error({
        message: `verifyAccessToken failed`,
        context: TokenService.name,
      });
      return this.createTokenPair(user);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  public async logoutRefreshToken(refreshToken: string): Promise<void> {
    try {
      if (!refreshToken) {
        throw new HttpException(
          'Refresh token not provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const refPayload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          publicKey: this.configService
            .get('AUTH_REFRESH_PUBLIC_KEY')
            ?.replace(/\\n/g, '\n'),
          algorithms: ['ES256'],
        },
      );

      if (!refPayload || refPayload.typ !== 'Refresh') {
        throw new HttpException(
          'Invalid or expired refresh token provided.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Failed to logout',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

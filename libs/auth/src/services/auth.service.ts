import { UserEntity } from '@app/db';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly ds: DataSource,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<UserEntity> {
    const user = await this.ds
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :identifier', { identifier: identifier })
      .orWhere('user.phone = :identifier', { identifier: identifier })
      .getOne();

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid Credential');
  }

  generateTokens(userId: number) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'access-secret', // should come from env
      expiresIn: '60s',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'refresh-secret', // should come from env
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): { sub: number } {
    return this.jwtService.verify(token, {
      secret: 'refresh-secret',
    });
  }
}

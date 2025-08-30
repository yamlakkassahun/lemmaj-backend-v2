import { IsString } from 'class-validator';

export class TokenPayload {
  // token expiry time
  exp: number;
  // time token issued at
  iat: number;
  // token type: Bearer | Refresh
  typ: string;
  // "http://localhost:8080/auth/realms/tp_admin"
  iss: string;
  // subject: users identity id (user's unique uuid) - exposed externally
  sub: string;
  // user role
  role: string;
  // user role id
  roleId: number;
}

export class TokensDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
export class TokensResponseDto {
  accessToken?: string;
  refreshToken?: string;
  success: boolean;
  statusCode: number;
  message: string;
}

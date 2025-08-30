import { IsString } from 'class-validator';
import { TokenPayload } from './tokens';

export class AccessTokenPayload extends TokenPayload {
  // user's name
  uname: string;
  // user's phone no
  phone: string;
  // users email
  email: string;
  // user id
  uid: number;
  // customer id
  cid?: number;
  // user company ids
  coids?: number[];
  // allowed endpoint domain
  domain?: string;

  status?: string;
}
export class AccessTokenDto {
  @IsString()
  accessToken: string;
}

export class GetUser extends TokenPayload {
  // user's name
  uname: string;
  // user's phone no
  phone: string;
  // users email
  email: string;
  // user id
  uid: number;
  // customer id
  cid?: number;
  // user company ids
  coids?: number[];
  // allowed endpoint domain
  domain?: string;

  status?: string;
}

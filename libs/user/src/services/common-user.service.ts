import { UserEntity } from '@app/db';
import { Injectable } from '@nestjs/common';
import { EntityManager, Not } from 'typeorm';

@Injectable()
export class CommonUserService {
  public async isEmailAlreadyUsed(
    m: EntityManager,
    email: string,
    userId?: number,
  ): Promise<boolean | undefined> {
    if (!email) return false;
    const where = { email };
    if (userId) {
      where['id'] = Not(userId);
    }
    const count = await m.count(UserEntity, { where });
    return count > 0;
  }

  public async isPhoneAlreadyUsed(
    m: EntityManager,
    phone: string,
    userId?: number,
  ): Promise<boolean | undefined> {
    const where = { phone };
    if (userId) {
      where['id'] = Not(userId);
    }
    const count = await m.count(UserEntity, { where });
    return count > 0;
  }
}

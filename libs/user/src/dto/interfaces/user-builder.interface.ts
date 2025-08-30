import { UserEntity } from '@app/db';
import { EntityManager } from 'typeorm';

export interface IUserBuilder {
  getUser(m?: EntityManager): Promise<UserEntity>;
}

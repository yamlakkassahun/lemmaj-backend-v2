import { Role, UserEntity } from '@app/db';
import { Injectable } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource, EntityManager } from 'typeorm';
import { userPageConfig } from '../dto/request-dto';

@Injectable()
export class GetUserService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(UserEntity),
      userPageConfig,
    );
  }

  public async getBy(
    opts: Partial<{
      id: number;
      idpId: string;
      parentId: number;
      partnerId: number;
      role: Role;
    }>,
  ): Promise<UserEntity | null> {
    const { id, idpId, parentId, role, partnerId } = opts;
    if (!id && !idpId && !parentId && !partnerId) return null;

    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.leftJoinAndSelect('userProfile.region', 'region');
    qb.leftJoinAndSelect('userProfile.subCity', 'subCity');
    qb.leftJoinAndSelect('user.licenseProfile', 'licenseProfile');
    qb.leftJoinAndSelect('user.role', 'role');

    if (id) {
      qb.andWhere('user.id = :id', { id });
    }
    // if (idpId) {
    //   qb.andWhere('user.idpId = :idpId', { idpId });
    // }
    // if (parentId) {
    //   qb.andWhere('user.parentUserId = :parentId', { parentId });
    // }
    // if (partnerId) {
    //   qb.andWhere('userProfile.partnerId = :partnerId', { partnerId });
    // }

    if (role) {
      qb.andWhere('user.roleId = :role', { role });
    }
    return await qb.getOne();
  }

  public async getByPhoneEmailAndRealm(
    m: EntityManager,
    phone?: string,
    email?: string,
  ): Promise<UserEntity | null> {
    const where = phone ? { phone } : { email };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userProfile: 'user.userProfile',
        },
      },
    });
  }

  public async getByUserId(
    m: EntityManager,
    userId: number,
  ): Promise<UserEntity | null> {
    const where = { id: userId };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userProfile: 'user.userProfile',
          role: 'user.role',
        },
      },
    });
  }
}

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CommonUserService } from './common-user.service';
import { IUserBuilder } from '../dto/interfaces';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/db';
import { GetUserService } from './get-user.service';
import { UpdateAdminPayload } from '../dto';
import { ObjectUtil } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from '@app/auth';

@Injectable()
export class UserService {
  constructor(
    private readonly ds: DataSource,
    private readonly common: CommonUserService,
    private readonly getUserService: GetUserService,
  ) {}

  public async createUser(
    builder: IUserBuilder,
  ): Promise<UserEntity | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();
      const _user = await builder.getUser(qryR.manager);

      if (_user.id) {
        await qryR.commitTransaction();
        return _user;
      }

      if (await this.common.isEmailAlreadyUsed(qryR.manager, _user.email)) {
        throw new HttpException(
          `Email is already used`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (await this.common.isPhoneAlreadyUsed(qryR.manager, _user.phone)) {
        throw new HttpException(
          `Phone number is already used`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await qryR.manager.save(UserEntity, _user);

      await qryR.commitTransaction();

      return user;
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          error?.message || error?.code,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      await qryR.release();
    }
  }

  public async updateUser(payload: UpdateAdminPayload): Promise<UserEntity> {
    const qryR = this.ds.createQueryRunner();

    try {
      await qryR.connect();
      await qryR.startTransaction();

      const updatePayload = payload.getUpdatePayload();

      if (updatePayload.id === undefined) {
        throw new BadRequestException(`User ID is required for update`);
      }
      const user = await this.getUserService.getByUserId(
        qryR.manager,
        updatePayload.id,
      );
      const _user = ObjectUtil.deepMerge(user, updatePayload);

      if (!user) {
        throw new BadRequestException(`Requested user not found`);
      }

      let isPhoneUsed: boolean | undefined = false,
        isEmailUsed: boolean | undefined = false;
      if (updatePayload.phone) {
        isPhoneUsed = await this.common.isPhoneAlreadyUsed(
          qryR.manager,
          updatePayload.phone,
          user.id,
        );
      }
      if (updatePayload.email) {
        isEmailUsed = await this.common.isEmailAlreadyUsed(
          qryR.manager,
          updatePayload.email,
          user.id,
        );
      }

      payload.validateUpdate(user, isPhoneUsed, isEmailUsed);
      if (!_user) {
        throw new BadRequestException('User data is invalid or not found');
      }
      const updatedUser = await qryR.manager.save(UserEntity, { ..._user });
      await qryR.commitTransaction();
      return updatedUser;
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          error?.message || error?.code,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      await qryR.release();
    }
  }

  public async updatePassword(
    userId: number,
    dto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const { oldPassword, newPassword } = dto;
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const user = await this.getUserService.getByUserId(qryR.manager, userId);
      if (!user || !(await bcrypt.compare(oldPassword, !user?.password))) {
        throw new BadRequestException(`User not found`);
      }

      user.password = bcrypt.hashSync(newPassword, 10);
      const updatedUser = await qryR.manager.save(UserEntity, user);

      await qryR.commitTransaction();
      return updatedUser;
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          error?.message || error?.code,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } finally {
      await qryR.release();
    }
  }
}

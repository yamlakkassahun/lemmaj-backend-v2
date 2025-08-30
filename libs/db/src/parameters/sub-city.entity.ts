import { BaseEntity } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../user';

@Entity({ name: 'sub_cities' })
export class SubCityEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => UserProfileEntity, (userProfile) => userProfile.region)
  userProfiles: UserProfileEntity[];

  toDto() {
    return plainToClass(SubCityEntity, this);
  }

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<SubCityEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

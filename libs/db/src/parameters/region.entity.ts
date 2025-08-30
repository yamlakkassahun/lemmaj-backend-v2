import { BaseEntity } from '@app/shared';
import { ApiProperty } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../user';

@Entity({ name: 'regions' })
export class RegionEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => UserProfileEntity, (userProfile) => userProfile.region)
  userProfiles: UserProfileEntity[];

  toDto() {
    return plainToClass(RegionEntity, this);
  }

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<RegionEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

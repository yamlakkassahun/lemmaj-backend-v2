import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity, GENDER_ENUM } from '@app/shared';
import { UserEntity } from './user.entity';
import { RegionEntity, SubCityEntity } from '../parameters';
import { plainToClass, instanceToPlain } from 'class-transformer';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  nationalId?: string;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'enum', enum: GENDER_ENUM, default: GENDER_ENUM.MALE })
  gender: string;

  @Column({ nullable: true })
  country?: string;

  // regions
  @ManyToOne(() => RegionEntity, (region) => region.userProfiles, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'region_id', referencedColumnName: 'id' })
  region?: RegionEntity;

  @Column({ name: 'region_id', nullable: true, unsigned: true })
  regionId?: number;

  @Column({ nullable: true })
  city?: string;

  // sub city
  @ManyToOne(() => SubCityEntity, (subCity) => subCity.userProfiles, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'sub_city_id', referencedColumnName: 'id' })
  subCity?: SubCityEntity;

  @Column({ name: 'sub_city_id', nullable: true, unsigned: true })
  subCityId?: number;

  @Column({ nullable: true })
  worda?: string;

  @Column({ nullable: true })
  trainingArea?: string;

  @OneToOne(() => UserEntity, (user) => user.userProfile, { nullable: false })
  user: UserEntity;

  toDto() {
    return plainToClass(UserProfileEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserProfileEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

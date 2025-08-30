import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity, GEAR_TYPE, GearTypeEnum } from '@app/shared';
import { LicenseTypeEntity } from '../parameters/license-type.entity';
import { UserEntity } from './user.entity';
import { plainToClass, instanceToPlain } from 'class-transformer';

@Entity('license_profiles')
export class LicenseProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  licensePic: string;

  @Column({ nullable: true })
  licenseBackPic: string;

  @ManyToOne(
    () => LicenseTypeEntity,
    (licenseType) => licenseType.licenseProfiles,
    {
      nullable: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'license_type_id', referencedColumnName: 'id' })
  licenseType: LicenseTypeEntity;

  @Column({ name: 'license_type_id', nullable: true, unsigned: true })
  licenseTypeId: number;

  @Column({ nullable: true })
  registrationNo: string;

  @Column({ type: 'enum', enum: GEAR_TYPE, default: GEAR_TYPE.BOTH })
  gearType: GearTypeEnum;

  @Column({ nullable: true })
  issuedDate: Date;

  @Column({ nullable: true })
  expiredDate: Date;

  @OneToOne(() => UserEntity, (user) => user.licenseProfile, {
    nullable: true,
  })
  user: UserEntity;

  toDto() {
    return plainToClass(LicenseProfileEntity, this);
  }

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<LicenseProfileEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

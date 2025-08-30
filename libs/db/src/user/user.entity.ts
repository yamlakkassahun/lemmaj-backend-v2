// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { BaseEntity, USER_STATUS, UserStatus } from '@app/shared';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { RoleEntity } from './role.entity';
import { LicenseProfileEntity } from './license-profile';
import { CertificateEntity } from './certificate.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @ManyToOne(() => RoleEntity, (o: RoleEntity) => o.users, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;

  @Column({ name: 'role_id', nullable: false, unsigned: true })
  roleId: number;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: 'PENDING',
    nullable: false,
  })
  status: UserStatus;

  @OneToOne(() => UserProfileEntity, (o) => o.user, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'user_profile_id', referencedColumnName: 'id' })
  userProfile: UserProfileEntity;

  @Column({ name: 'user_profile_id', nullable: false, unsigned: true })
  userProfileId: number;

  @OneToOne(() => LicenseProfileEntity, (o) => o.user, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'license_profile_id', referencedColumnName: 'id' })
  licenseProfile?: LicenseProfileEntity;

  @Column({ name: 'license_profile_id', nullable: true, unsigned: true })
  licenseProfileId?: number;

  @OneToMany(() => CertificateEntity, (certificate) => certificate.user)
  certificates?: CertificateEntity[];

  toDto() {
    return plainToClass(UserEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}

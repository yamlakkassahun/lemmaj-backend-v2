import { BaseEntity } from '@app/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { LicenseProfileEntity } from '../user/license-profile';
import { LicenseEntity } from '../user/license.entity';

@Entity({ name: 'license_types' })
export class LicenseTypeEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  description?: string;

  @OneToMany(() => LicenseProfileEntity, (license) => license.licenseType)
  licenseProfiles: LicenseProfileEntity[];

  toDto() {
    return plainToClass(LicenseTypeEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<LicenseTypeEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

import { LicenseTypeEntity } from './license-type.entity';
import { NotificationEntity } from './notification.entity';
import { RegionEntity } from './region.entity';
import { SubCityEntity } from './sub-city.entity';

export * from './license-type.entity';
export * from './region.entity';
export * from './sub-city.entity';
export * from './notification.entity';

export const PARAMETER_ENTITY = [
  LicenseTypeEntity,
  RegionEntity,
  SubCityEntity,
  NotificationEntity
];

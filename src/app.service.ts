import { DataSource } from 'typeorm';

import {
  LicenseTypeEntity,
  RegionEntity,
  REGIONS_SEED,
  RoleEntity,
  ROLES_SEED,
  SUB_CITIES_SEED,
  SubCityEntity,
  LICENSE_TYPE_SEED,
} from '@app/db';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private ds: DataSource) { }
  getHello(): string {
    return 'Hello World!';
  }


  async seedData() {
    const result = {};
    Logger.log('Running system data initialization...');
    await Promise.all([
      this.initRoles(),
      this.initRegions(),
      this.initSubCity(),
      this.initLicenseType(),
    ]);

    Logger.log('System data initialization Completed.');
    return result;
  }

  private async initRoles() {
    const initialCount = await this.ds.getRepository(RoleEntity).count();
    if (initialCount === 0) {
      const data: RoleEntity[] = [];
      for (let i = 0; i < ROLES_SEED.length; i++) {
        const o = ROLES_SEED[i];
        data.push(new RoleEntity({ ...o }));
      }
      await this.ds.getRepository(RoleEntity).insert(data);
    }
    const finalCount = await this.ds.getRepository(RoleEntity).count();
    Logger.log(
      `Roles: [Initial Count = ${initialCount}, Final Count: ${finalCount}]`,
    );
    return { initialCount, finalCount };
  }

  private async initRegions() {
    const initialCount = await this.ds.getRepository(RegionEntity).count();
    if (initialCount === 0) {
      const data: RegionEntity[] = [];
      for (let i = 0; i < REGIONS_SEED.length; i++) {
        const o = REGIONS_SEED[i];
        data.push(new RegionEntity({ ...o }));
      }
      await this.ds.getRepository(RegionEntity).insert(data);
    }
    const finalCount = await this.ds.getRepository(RegionEntity).count();
    Logger.log(
      `Regions: [Initial Count = ${initialCount}, Final Count: ${finalCount}]`,
    );
    return { initialCount, finalCount };
  }

  private async initSubCity() {
    const initialCount = await this.ds.getRepository(SubCityEntity).count();
    if (initialCount === 0) {
      const data: SubCityEntity[] = [];
      for (let i = 0; i < SUB_CITIES_SEED.length; i++) {
        const o = SUB_CITIES_SEED[i];
        data.push(new SubCityEntity({ ...o }));
      }
      await this.ds.getRepository(SubCityEntity).insert(data);
    }
    const finalCount = await this.ds.getRepository(SubCityEntity).count();
    Logger.log(
      `Sub City: [Initial Count = ${initialCount}, Final Count: ${finalCount}]`,
    );
    return { initialCount, finalCount };
  }

  private async initLicenseType() {
    const initialCount = await this.ds.getRepository(LicenseTypeEntity).count();
    if (initialCount === 0) {
      const data: LicenseTypeEntity[] = [];
      for (let i = 0; i < LICENSE_TYPE_SEED.length; i++) {
        const o = LICENSE_TYPE_SEED[i];
        data.push(new LicenseTypeEntity({ ...o }));
      }
      await this.ds.getRepository(LicenseTypeEntity).insert(data);
    }
    const finalCount = await this.ds.getRepository(LicenseTypeEntity).count();
    Logger.log(
      `License Type: [Initial Count = ${initialCount}, Final Count: ${finalCount}]`,
    );
    return { initialCount, finalCount };
  }
}

import { LicenseTypeEntity } from '@app/db';
import { Injectable } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { licenseTypePageConfig } from '../dtos';

@Injectable()
export class LicenseTypeService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<LicenseTypeEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(LicenseTypeEntity),
      licenseTypePageConfig,
    );
  }
}

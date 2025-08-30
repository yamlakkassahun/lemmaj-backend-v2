import { RegionEntity } from '@app/db';
import { regionPageConfig } from '../dtos';
import { Injectable } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(query: PaginateQuery): Promise<Paginated<RegionEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(RegionEntity),
      regionPageConfig,
    );
  }
}

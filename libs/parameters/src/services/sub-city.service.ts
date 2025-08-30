import { SubCityEntity } from '@app/db';
import { subCityPageConfig } from '../dtos';
import { Injectable } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';

@Injectable()
export class SubCityService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<SubCityEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(SubCityEntity),
      subCityPageConfig,
    );
  }
}

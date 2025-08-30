import { RegionEntity } from '@app/db';
import { PaginateConfig, FilterOperator } from 'nestjs-paginate';

export const regionPageConfig: PaginateConfig<RegionEntity> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name'],
  select: ['id', 'name', 'createdAt', 'updatedAt'],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
  },
  relations: [],
};

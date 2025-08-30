import { LicenseTypeEntity } from '@app/db';
import { PaginateConfig, FilterOperator } from 'nestjs-paginate';

export const licenseTypePageConfig: PaginateConfig<LicenseTypeEntity> = {
  sortableColumns: ['id', 'name'],
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
  filterableColumns: {
    name: [FilterOperator.ILIKE],
  },
  relations: [],
};

import { LicenseTypeEntity } from '@app/db';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { LicenseTypeService } from '../services';
import { licenseTypePageConfig } from '../dtos';
import { Public } from '@app/shared';

@ApiTags('Parameters')
@ApiCookieAuth()
@Controller('license-types')
export class LicenseTypeController {
  constructor(private readonly licenseTypeService: LicenseTypeService) {}

  @Get()
  @Public()
  @ApiOkPaginatedResponse(LicenseTypeEntity, licenseTypePageConfig)
  @ApiPaginationQuery(licenseTypePageConfig)
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<LicenseTypeEntity>> {
    return this.licenseTypeService.findAll(query);
  }
}

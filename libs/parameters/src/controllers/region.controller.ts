import { RegionEntity } from '@app/db';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { RegionService } from '../services';
import { regionPageConfig } from '../dtos';
import { Public } from '@app/shared';

@ApiTags('Parameters')
@ApiCookieAuth()
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  @Public()
  @ApiOkPaginatedResponse(RegionEntity, regionPageConfig)
  @ApiPaginationQuery(regionPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<RegionEntity>> {
    return this.regionService.findAll(query);
  }
}

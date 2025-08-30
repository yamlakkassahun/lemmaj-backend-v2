import { SubCityEntity } from '@app/db';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { SubCityService } from '../services';
import { subCityPageConfig } from '../dtos';
import { Public } from '@app/shared';

@ApiTags('Parameters')
@ApiCookieAuth()
@Controller('sub-cities')
export class SubCityController {
  constructor(private readonly subCityService: SubCityService) {}

  @Get()
  @Public()
  @ApiOkPaginatedResponse(SubCityEntity, subCityPageConfig)
  @ApiPaginationQuery(subCityPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<SubCityEntity>> {
    return this.subCityService.findAll(query);
  }
}

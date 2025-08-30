import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  CreatePackageDto,
  packagePageConfig,
  UpdatePackageDto,
} from '../dtos/package.dto';
import { PackageService } from '../services';
import { PackageEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/shared';

@ApiTags('Lesson-Material')
@Controller('packages')
@ApiCookieAuth()
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @Public()
  @ApiOkPaginatedResponse(PackageEntity, packagePageConfig)
  @ApiPaginationQuery(packagePageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<PackageEntity>> {
    return this.packageService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.packageService.findOne(id);
  }

  @Post()
  @Public()
  create(@Body() dto: CreatePackageDto) {
    return this.packageService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePackageDto) {
    return this.packageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(id);
  }
}

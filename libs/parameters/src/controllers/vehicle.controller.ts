import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { VehicleService } from '../services';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  vehiclePageConfig,
} from '../dtos/vehicle-dto';
import { VehicleEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Parameters')
@ApiCookieAuth()
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehicleService.create(dto);
  }

  @Get()
  @ApiOkPaginatedResponse(VehicleEntity, vehiclePageConfig)
  @ApiPaginationQuery(vehiclePageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<VehicleEntity>> {
    return this.vehicleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehicleService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(+id);
  }
}

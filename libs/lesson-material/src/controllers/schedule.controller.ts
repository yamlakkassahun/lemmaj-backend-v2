import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { ScheduleService } from '../services';
import { ScheduleEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { schedulePageConfig, UpdateScheduleDto, UpdateScheduleTimeDto } from '../dtos';
import { Public } from '@app/shared';

@ApiTags('Lesson-Material')
@Controller('schedules')
@ApiCookieAuth()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Get()
  @ApiOkPaginatedResponse(ScheduleEntity, schedulePageConfig)
  @ApiPaginationQuery(schedulePageConfig)
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ScheduleEntity>> {
    return this.scheduleService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  @Public()
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(+id, dto);
  }

  @Patch('update-time')
  updateScheduleTime(@Body() dto: UpdateScheduleTimeDto): Promise<ScheduleEntity> {
    return this.scheduleService.updateScheduleTime(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}

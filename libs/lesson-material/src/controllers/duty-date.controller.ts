import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { DutyDateService } from '../services';
import {
  CreateDutyDateDto,
  dutyDatePageConfig,
  GenerateDutyDatesDto,
  UpdateDutyDateDto,
} from '../dtos';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { DutyDateEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { GetUser, Public } from '@app/shared';

@ApiTags('Lesson-Material')
@Controller('duty-dates')
@ApiCookieAuth()
export class DutyDateController {
  constructor(private readonly dutyDateService: DutyDateService) { }

  @Post()
  create(@Body() dto: CreateDutyDateDto) {
    return this.dutyDateService.create(dto);
  }

  @Get()
  @Public()
  @ApiOkPaginatedResponse(DutyDateEntity, dutyDatePageConfig)
  @ApiPaginationQuery(dutyDatePageConfig)
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<DutyDateEntity>> {
    return this.dutyDateService.findAll(query);
  }

  @Post('generate-weekly')
  async generateDutyDates(
    @Body() dto: GenerateDutyDatesDto,
    @GetUser() user: any,
  ): Promise<DutyDateEntity[]> {
    dto.instructorId = user.uid;
    return this.dutyDateService.generateDutyDates(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.dutyDateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDutyDateDto) {
    return this.dutyDateService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.dutyDateService.remove(id);
  }
}

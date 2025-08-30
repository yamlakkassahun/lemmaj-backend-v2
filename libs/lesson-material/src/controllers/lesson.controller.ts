import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LessonService } from '../services/lesson.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CreateLessonDto, lessonPageConfig, UpdateLessonDto } from '../dtos';
import { LessonEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { Public } from '@app/shared';

@Controller('lessons')
@ApiTags('Lesson-Material')
@ApiCookieAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Get()
  @ApiOkPaginatedResponse(LessonEntity, lessonPageConfig)
  @ApiPaginationQuery(lessonPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<LessonEntity>> {
    return this.lessonService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}

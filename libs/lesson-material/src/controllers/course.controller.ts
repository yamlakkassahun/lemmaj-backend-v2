import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from '../dtos/course.dto';
import { CourseService } from '../services';
import { CourseEntity, UserEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { coursePageConfig } from '../dtos';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Lesson-Material')
@Controller('courses')
@ApiCookieAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOkPaginatedResponse(UserEntity, coursePageConfig)
  @ApiPaginationQuery(coursePageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<CourseEntity>> {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.courseService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}

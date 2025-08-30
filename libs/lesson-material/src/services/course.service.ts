import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { coursePageConfig, CreateCourseDto, UpdateCourseDto } from '../dtos';
import { CourseEntity } from '@app/db';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class CourseService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(query: PaginateQuery): Promise<Paginated<CourseEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(CourseEntity),
      coursePageConfig,
    );
  }

  public async findOne(id: number): Promise<CourseEntity> {
    return await this.ds
      .getRepository(CourseEntity)
      .findOneOrFail({ where: { id } });
  }

  public async create(dto: CreateCourseDto): Promise<CourseEntity> {
    const course = this.ds.getRepository(CourseEntity).create(dto);
    return this.ds.getRepository(CourseEntity).save(course);
  }

  async update(id: number, dto: UpdateCourseDto): Promise<CourseEntity> {
    const pkg = await this.ds
      .getRepository(CourseEntity)
      .findOne({ where: { id } });

    if (!pkg) throw new NotFoundException('Course not found');

    const updated = Object.assign(pkg, dto);
    return await this.ds.getRepository(CourseEntity).save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ds.getRepository(CourseEntity).delete(id);
    if (result.affected === 0) throw new NotFoundException('Course not found');
  }
}

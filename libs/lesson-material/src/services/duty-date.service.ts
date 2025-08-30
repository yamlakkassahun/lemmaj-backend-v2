// duty-date.service.ts
import { DutyDateEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateDutyDateDto,
  dutyDatePageConfig,
  UpdateDutyDateDto,
} from '../dtos';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class DutyDateService {
  constructor(private readonly ds: DataSource) {}

  async create(dto: CreateDutyDateDto): Promise<DutyDateEntity> {
    const dutyDate = this.ds.getRepository(DutyDateEntity).create({
      ...dto,
      instructor: { id: dto.instructorId } as any,
    });
    return this.ds.getRepository(DutyDateEntity).save(dutyDate);
  }

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<DutyDateEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(DutyDateEntity),
      dutyDatePageConfig,
    );
  }

  async findOne(id: number): Promise<DutyDateEntity> {
    const dutyDate = await this.ds.getRepository(DutyDateEntity).findOne({
      where: { id },
      relations: ['instructor'],
    });
    if (!dutyDate)
      throw new NotFoundException(`DutyDate with id ${id} not found`);
    return dutyDate;
  }

  async update(id: number, dto: UpdateDutyDateDto): Promise<DutyDateEntity> {
    const dutyDate = await this.findOne(id);
    Object.assign(dutyDate, {
      ...dto,
      instructorId: dto.instructorId
        ? { id: dto.instructorId }
        : dutyDate.instructor,
    });
    return this.ds.getRepository(DutyDateEntity).save(dutyDate);
  }

  async remove(id: number): Promise<void> {
    const dutyDate = await this.findOne(id);
    await this.ds.getRepository(DutyDateEntity).remove(dutyDate);
  }
}

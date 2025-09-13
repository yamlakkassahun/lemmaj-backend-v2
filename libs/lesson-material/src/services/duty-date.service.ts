// duty-date.service.ts
import { DutyDateEntity, UserEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateDutyDateDto,
  dutyDatePageConfig,
  GenerateDutyDatesDto,
  UpdateDutyDateDto,
} from '../dtos';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class DutyDateService {
  constructor(private readonly ds: DataSource) { }

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
    if (dutyDate.status !== 'Available') throw new NotFoundException(`DutyDate Can not be deleted`);
    await this.ds.getRepository(DutyDateEntity).remove(dutyDate);
  }


  // duty-date.service.ts
  async generateDutyDates(dto: GenerateDutyDatesDto): Promise<DutyDateEntity[]> {
    const { instructorId, startDate, endDate, startTime, endTime, status, weekday } = dto;

    const instructor = await this.ds.getRepository(UserEntity).findOne({ where: { id: instructorId } });

    if (!instructor) throw new NotFoundException('Instructor not found');

    const weekdayIndex = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ].indexOf(weekday);

    if (weekdayIndex === -1) {
      throw new Error('Invalid weekday');
    }

    const dutyDates: DutyDateEntity[] = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    // move currentDate to the first requested weekday
    while (currentDate.getDay() !== weekdayIndex) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // generate weekly dates until endDate
    while (currentDate <= finalDate) {
      dutyDates.push(
        new DutyDateEntity({
          date: new Date(currentDate),
          instructor,
          startTime,
          endTime,
          status,
        }),
      );

      // jump one week ahead
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return this.ds.getRepository(DutyDateEntity).save(dutyDates);
  }

}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateLessonDto, lessonPageConfig, UpdateLessonDto } from '../dtos';
import { LessonEntity } from '@app/db/lesson-material/lesson.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { CourseEntity, PackageEntity, ScheduleEntity } from '@app/db';
import { NotificationService } from '@app/parameters';

@Injectable()
export class LessonService {
  constructor(@InjectDataSource() private readonly ds: DataSource, private readonly noficy: NotificationService) { }

  private _scheduleCoursesIntoTwoHourClasses(courses: CourseEntity[]) {
    const twoHourClasses: { label: string; duration: number }[][] = [];
    let currentClass: { label: string; duration: number }[] = [];
    let remainingTime = 120;

    for (const course of courses) {
      let durationRemaining = course.length;

      while (durationRemaining > 0) {
        const chunkDuration = Math.min(durationRemaining, remainingTime);

        currentClass.push({
          label: course.label,
          duration: chunkDuration,
        });

        remainingTime -= chunkDuration;
        durationRemaining -= chunkDuration;

        if (remainingTime === 0) {
          twoHourClasses.push(currentClass);
          currentClass = [];
          remainingTime = 120;
        }
      }
    }

    // Add any remaining courses that didn't fill a full 2-hour slot
    if (currentClass.length > 0) {
      twoHourClasses.push(currentClass);
    }

    return twoHourClasses;
  }

  async create(dto: CreateLessonDto) {
    try {
      const repo = this.ds.getRepository(LessonEntity);
      let scheduleList: ScheduleEntity[] = [];
      const { packageId, studentId } = dto;

      // get the package
      const _package = await this.ds
        .getRepository(PackageEntity)
        .findOne({ where: { id: packageId }, relations: ['courses'] });

      // create lesson

      const existing = await repo.findOneBy({
        packageId: dto.packageId,
        studentId: dto.studentId,
      });


      if (existing) {
        throw new BadRequestException('Package Has Been Alrady Regiterd');
      } else {
        const _lesson = this.ds
          .getRepository(LessonEntity)
          .create({ ...dto, duration: _package?.duration, price: _package?.price });

        const lesson = await this.ds.getRepository(LessonEntity).save(_lesson);

        if (_package !== null) {
          const schedules = this._scheduleCoursesIntoTwoHourClasses(
            _package.courses,
          );

          schedules.forEach(async (schedule) => {
            const _res = this.ds.getRepository(ScheduleEntity).create({
              date: new Date(),
              student: { id: lesson.studentId },
              lesson: { id: lesson.id },
              courses: schedule,
              status: 'PENDING',
            });
            scheduleList.push(_res);
          });

          await this.ds.getRepository(ScheduleEntity).insert(scheduleList);
        }

        await this.noficy.create({
          title: 'New Lesson Request',
          description: 'Your Lesson request is beeing processed. please wait.',
          userId: dto.studentId,
        })


        await this.noficy.create({
          title: `New Lesson Request For ${_package?.name} Package`,
          description: 'User has Requested for this package and is ready to be processed.',
          userId: 1,
        })

        const res = await this.ds
          .getRepository(LessonEntity).update(lesson.id, {
            certificateUrl: `certificate/${studentId}-${lesson.id}-certificate.pdf`
          });

        return res;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<LessonEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(LessonEntity),
      lessonPageConfig,
    );
  }

  async findOne(id: number): Promise<LessonEntity> {
    const lesson = await this.ds
      .getRepository(LessonEntity)
      .findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(id: number, dto: UpdateLessonDto): Promise<LessonEntity> {
    const { status } = dto;
    try {
      return await this.ds.transaction(async (manager) => {
        const lessonRepo = manager.getRepository(LessonEntity);
        const scheduleRepo = manager.getRepository(ScheduleEntity);

        const lesson = await lessonRepo.findOne({ where: { id } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const updated = lessonRepo.merge(lesson, dto);

        // Update related schedules
        await scheduleRepo
          .createQueryBuilder()
          .update(ScheduleEntity)
          .set({ instructor: { id: dto.instructorId } })
          .where('lesson_id = :lessonId', { lessonId: id })
          .execute();

        if (status === 'APPROVED') {
          await Promise.all([
            this.noficy.create({
              title: `Lesson Request Has Been ${status}`,
              description: `Your Lesson request has been processed and it has been ${status}`,
              userId: lesson.studentId,
            }),

            this.noficy.create({
              title: `Lesson Request Has Been ${status}`,
              description: `Your Lesson request has been processed and it has been ${status}`,
              userId: lesson.instructorId,
            })
          ])
        }

        if (lesson.instructor === null) {
          await this.noficy.create({
            title: `Congradulation!, You Have Been Selected As An Instractor.`,
            description: `You Have Been Selected As An Instractor`,
            userId: dto.instructorId,
          })
        }

        return await lessonRepo.save(updated);

      });
    } catch (error) {
      throw new NotFoundException('Error updating lesson', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    const repo = this.ds.getRepository(LessonEntity);
    const lesson = await repo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    await repo.remove(lesson);
  }
}

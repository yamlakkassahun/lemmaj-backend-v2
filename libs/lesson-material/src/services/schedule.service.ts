import { DutyDateEntity, LessonEntity, ScheduleEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { schedulePageConfig, UpdateScheduleDto, UpdateScheduleTimeDto } from '../dtos';
import * as fs from 'fs';
import puppeteer from 'puppeteer';
import { NotificationService } from '@app/parameters';

@Injectable()
export class ScheduleService {
  constructor(private readonly ds: DataSource, private readonly noficy: NotificationService) { }

  async generatePdf(name, id) {
    fs.mkdirSync('./images/certificate', { recursive: true });

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser', // On Alpine, it's chromium-browser
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(`
    <html>
    <head>
      <style>
        body, html { margin: 0; padding: 0; }
        body { color: black; display: table; font-family: Georgia, serif; font-size: 24px; text-align: center; }
        .container { border: 30px solid #FFFDFC; width: 1200px; height: 795px; display: table-cell; vertical-align: middle; }
        .logo { color: tan; }
        .marquee { color: tan; font-size: 48px; margin: 20px; }
        .assignment { margin: 20px; }
        .person { border-bottom: 2px solid black; font-size: 32px; font-style: italic; margin: 20px auto; width: 400px; }
        .reason { margin: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Lemmaj Learning Center</div>
        <div class="marquee">Certificate of Completion</div>
        <div class="assignment">This certificate is presented to</div>
        <div class="person">${name}</div>
        <div class="reason">For deftly defying the laws of gravity<br/>and flying high</div>
      </div>
    </body>
    </html>
  `, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: `./images/certificate/${id}-certificate.pdf`,
      format: 'A4',
      landscape: true,
    });

    await browser.close();
  }

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<ScheduleEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(ScheduleEntity),
      schedulePageConfig,
    );
  }

  public async findOne(id: number): Promise<ScheduleEntity> {
    const pkg = await this.ds.getRepository(ScheduleEntity).findOne({
      where: { id },
      relations: ['instructor', 'student', 'dutyDate', 'lesson'],
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const { dutyDateId } = dto;
    const repo = this.ds.getRepository(ScheduleEntity);
    const existing = await repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Schedule not found');

    const dutyDate = await this.ds.getRepository(DutyDateEntity).findOne({
      where: { id: dutyDateId },
    });
    if (!dutyDate)
      throw new NotFoundException(`DutyDate with id ${id} not found`);

    const updated = repo.merge(existing, {
      ...dto,
      date: dutyDate.date,
      instructor: dto.instructorId ? { id: dto.instructorId } : undefined,
      dutyDate: dto.dutyDateId ? { id: dto.dutyDateId } : undefined,
      vehicle: dto.vehicleId ? { id: dto.vehicleId } : undefined,
    });


    if (dto.status === 'BOOKED' || dto.status === 'APPROVED') {
      await Promise.all([
        this.noficy.create({
          title: `Congratulations Schedule Has Been ${dto.status.toLowerCase()} Successfully!`,
          description: 'Please, waite for approval',
          userId: existing?.student?.id,
        }),
        this.noficy.create({
          title: `Congratulations Schedule Has Been ${dto.status.toLowerCase()} Successfully!`,
          description: 'Please, waite for approval',
          userId: existing?.instructor?.id,
        })
      ])
    }

    return await repo.save(updated);
  }

  async updateScheduleTime(dto: UpdateScheduleTimeDto): Promise<ScheduleEntity> {
    const repo = this.ds.getRepository(ScheduleEntity);
    const schedule = await repo.findOne({ where: { id: dto.scheduleId } });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Update instructor time if provided
    if (dto.instractorTime) {
      await this.noficy.create({
        title: `Schedule Has Started By Instractor`,
        description: '',
        userId: 1,
      });
      schedule.instractorTime = {
        ...schedule.instractorTime,
        ...(dto.instractorTime.startTime && { startTime: new Date(dto.instractorTime.startTime) }),
        ...(dto.instractorTime.endTime && { endTime: new Date(dto.instractorTime.endTime) }),
        ...(dto.instractorTime.hasStarted !== undefined && { hasStarted: dto.instractorTime.hasStarted }),
        ...(dto.instractorTime.hasEnded !== undefined && { hasEnded: dto.instractorTime.hasEnded }),
      };
    }

    // Update student time if provided
    if (dto.studentTime) {
      await this.noficy.create({
        title: `Schedule Has Started By Student`,
        description: '',
        userId: 1,
      });
      schedule.studentTime = {
        ...schedule.studentTime,
        ...(dto.studentTime.startTime && { startTime: new Date(dto.studentTime.startTime) }),
        ...(dto.studentTime.endTime && { endTime: new Date(dto.studentTime.endTime) }),
        ...(dto.studentTime.hasStarted !== undefined && { hasStarted: dto.studentTime.hasStarted }),
        ...(dto.studentTime.hasEnded !== undefined && { hasEnded: dto.studentTime.hasEnded }),
      };
    }

    if (schedule.instractorTime.hasEnded && schedule.studentTime.hasEnded) {
      schedule.status = 'DONE';
      await this.noficy.create({
        title: 'Congratulations Schedule Has Been Completed Successfully!',
        description: 'Congratulations Session Has Been Completed Successfully!',
        userId: schedule?.student?.id,
      })


      await this.noficy.create({
        title: 'Congratulations Schedule Has Been Completed Successfully!',
        description: 'Congratulations Session Has Been Completed Successfully!',
        userId: schedule?.instructor?.id,
      })

      await this.noficy.create({
        title: `Schedule Has Been Completed Successfully`,
        description: 'Schedule has been Completed Successfully',
        userId: 1,
      });

      try {
        await this.generatePdf(`${schedule?.student?.userProfile?.firstName} ${schedule?.student?.userProfile.lastName}`, `${schedule?.student?.id}-${schedule?.lesson?.id}`);
        await this.ds.getRepository(LessonEntity).update(schedule?.lesson?.id, { status: 'COMPLETED' })
      } catch (e) {
        console.log(e);
      }
    }

    return await repo.save(schedule);
  }


  async remove(id: number) {
    const repo = this.ds.getRepository(ScheduleEntity);
    const entity = await repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Schedule not found');
    return await repo.softRemove(entity);
  }



}

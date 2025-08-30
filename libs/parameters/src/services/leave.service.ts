import { LeaveEntity, ScheduleEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CreateLeaveDto, leavePageConfig, UpdateLeaveDto } from '../dtos';
import { NotificationService } from './notification.service';

@Injectable()
export class LeaveService {
    constructor(private readonly ds: DataSource, private readonly noficy: NotificationService) { }

    public async findAll(
        query: PaginateQuery,
    ): Promise<Paginated<LeaveEntity>> {
        return await paginate(
            query,
            this.ds.getRepository(LeaveEntity),
            leavePageConfig,
        );
    }

    async create(dto: CreateLeaveDto): Promise<LeaveEntity> {
        const leave = this.ds.getRepository(LeaveEntity).create({
            ...dto,
            // studentId: schedule?.student?.id,
        });

        const res = await this.ds.getRepository(LeaveEntity).save(leave);

        await this.noficy.create({
            title: 'Leave Request Notifcation',
            description: 'Your Leave request is beeing processed. please wait.',
            userId: dto.instructorId,
        })
        return res
    }

    async findOne(id: number): Promise<LeaveEntity> {
        const vehicle = await this.ds
            .getRepository(LeaveEntity)
            .findOne({ where: { id } });
        if (!vehicle) throw new NotFoundException('Vehicle not found');
        return vehicle;
    }

    async update(id: number, dto: UpdateLeaveDto): Promise<LeaveEntity> {
        const vehicle = await this.findOne(id);
        Object.assign(vehicle, dto);
        return this.ds.getRepository(LeaveEntity).save(vehicle);
    }

    async remove(id: number): Promise<void> {
        const vehicle = await this.findOne(id);
        await this.ds.getRepository(LeaveEntity).remove(vehicle);
    }
}

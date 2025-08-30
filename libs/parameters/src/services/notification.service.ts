import { NotificationEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { DataSource } from 'typeorm';
import { CreateLeaveDto, leavePageConfig, UpdateLeaveDto } from '../dtos';
import { CreateNotificationDto, notificationPageConfig } from '../dtos/notification.dto';

@Injectable()
export class NotificationService {
    constructor(private readonly ds: DataSource) { }

    public async findAll(
        query: PaginateQuery,
    ): Promise<Paginated<NotificationEntity>> {
        return await paginate(
            query,
            this.ds.getRepository(NotificationEntity),
            notificationPageConfig,
        );
    }

    async create(dto: CreateNotificationDto): Promise<NotificationEntity> {
        const vehicle = this.ds.getRepository(NotificationEntity).create(dto);
        return await this.ds.getRepository(NotificationEntity).save(vehicle);
    }

    async findOne(id: number): Promise<NotificationEntity> {
        const vehicle = await this.ds
            .getRepository(NotificationEntity)
            .findOne({ where: { id } });
        if (!vehicle) throw new NotFoundException('Vehicle not found');
        return vehicle;
    }

    async remove(id: number): Promise<void> {
        const vehicle = await this.findOne(id);
        await this.ds.getRepository(NotificationEntity).remove(vehicle);
    }
}

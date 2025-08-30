import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateReviewDto, UpdateReviewDto } from '../dtos';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { reviewPageConfig } from '../dtos';
import { ReviewEntity, ScheduleEntity } from '@app/db';
import { NotificationService } from '@app/parameters';

@Injectable()
export class ReviewService {
    constructor(private readonly ds: DataSource, private readonly noficy: NotificationService) { }

    public async findAll(query: PaginateQuery): Promise<Paginated<ReviewEntity>> {
        return await paginate(
            query,
            this.ds.getRepository(ReviewEntity),
            reviewPageConfig,
        );
    }

    public async findOne(id: number): Promise<ReviewEntity> {
        return await this.ds
            .getRepository(ReviewEntity)
            .findOneOrFail({ where: { id } });
    }

    public async create(dto: CreateReviewDto): Promise<ReviewEntity> {
        const { scheduleId, rating, instructorId } = dto
        const Review = this.ds.getRepository(ReviewEntity).create(dto);

        // set the schedule 
        await this.ds
            .getRepository(ScheduleEntity)
            .update(scheduleId, { hasBeenReviewed: true });

        if (rating <= 2) {
            await this.noficy.create({
                title: 'Bad Review Has Been Given!',
                description: 'Please Review this!',
                userId: instructorId,
            })
        }

        return this.ds.getRepository(ReviewEntity).save(Review);
    }

    async update(id: number, dto: UpdateReviewDto): Promise<ReviewEntity> {
        const pkg = await this.ds
            .getRepository(ReviewEntity)
            .findOne({ where: { id } });
        if (!pkg) throw new NotFoundException('Review not found');
        const updated = Object.assign(pkg, dto);
        return await this.ds.getRepository(ReviewEntity).save(updated);
    }

    async remove(id: string): Promise<void> {
        const result = await this.ds.getRepository(ReviewEntity).delete(id);
        if (result.affected === 0) throw new NotFoundException('Review not found');
    }
}

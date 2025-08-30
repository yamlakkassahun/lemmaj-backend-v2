import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@app/shared';
import { UserEntity } from '../user';
import { ScheduleEntity } from './schedule.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'instructor_id' })
    instructor: UserEntity;

    @Column({ name: 'instructor_id', type: 'int', unsigned: true, nullable: false })
    instructorId: number;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'student_id' })
    student: UserEntity;

    @Column({ name: 'student_id', type: 'int', unsigned: true, nullable: false })
    studentId: number;

    @ManyToOne(() => ScheduleEntity, { nullable: false })
    @JoinColumn({ name: 'schedule_id' })
    schedule: ScheduleEntity;

    @Column({ name: 'schedule_id', type: 'int', unsigned: true, nullable: false })
    scheduleId: number;

    @Column({ type: 'int', default: 5 })
    rating: number;

    @Column({ type: 'text', nullable: true })
    review: string;

    constructor(partial: Partial<ReviewEntity>) {
        super();
        return Object.assign(this, partial);
    }
}

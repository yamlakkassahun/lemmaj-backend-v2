import { BaseEntity } from '@app/shared';
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { DutyDateEntity } from './due-date.entity';
import { UserEntity } from '../user';
import { ScheduleEntity } from './schedule.entity';

@Entity('leaves')
export class LeaveEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    instructor: UserEntity;

    @Column({ name: 'user_id', type: 'int', unsigned: true, nullable: false })
    instructorId: number;

    @ManyToOne(() => DutyDateEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'duty_date_id', referencedColumnName: 'id' })
    dutyDate: DutyDateEntity;

    @Column({ name: 'duty_date_id', type: 'int', unsigned: true, nullable: false })
    dutyDateId: number;

    @Column({ type: 'boolean', nullable: false, default: false })
    isApproved: boolean;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    constructor(partial: Partial<LeaveEntity>) {
        super();
        return Object.assign(this, partial);
    }
}

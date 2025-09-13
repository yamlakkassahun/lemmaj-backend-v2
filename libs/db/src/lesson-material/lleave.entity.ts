import { BaseEntity } from '@app/shared';
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { DutyDateEntity } from './due-date.entity';
import { UserEntity } from '../user';
import { LessonEntity } from './lesson.entity';

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

    @ManyToOne(() => UserEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
    student: UserEntity;

    @Column({ name: 'student_id', type: 'int', unsigned: true, nullable: false })
    studentId: number;

    @ManyToOne(() => LessonEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
    lesson: LessonEntity;

    @Column({ name: 'lesson_id', type: 'int', unsigned: true, nullable: false })
    lessonId: number;

    @Column({ type: 'boolean', nullable: false, default: false })
    isApproved: boolean;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    constructor(partial: Partial<LeaveEntity>) {
        super();
        return Object.assign(this, partial);
    }
}

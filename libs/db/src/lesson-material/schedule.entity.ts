import { BaseEntity } from '@app/shared';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user';
import { DutyDateEntity } from './due-date.entity';
import { LessonEntity } from './lesson.entity';
import { VehicleEntity } from './vehicle.entity';

@Entity('schedules')
export class ScheduleEntity extends BaseEntity {
  @Column()
  date: Date;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor?: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'student_id' })
  student?: UserEntity;

  @ManyToOne(() => DutyDateEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'duty_date_id' })
  dutyDate?: DutyDateEntity;

  @ManyToOne(() => LessonEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;

  @Column({ type: 'boolean', default: false })
  hasBeenReviewed: boolean;

  @Column('json')
  courses: { label: string; duration: number }[];

  @Column('json', { nullable: false })
  instractorTime: {
    hasStarted: boolean;
    hasEnded: boolean;
    startTime: Date;
    endTime: Date;
  };

  @Column('json', { nullable: false })
  studentTime: {
    hasStarted: boolean;
    hasEnded: boolean;
    startTime: Date;
    endTime: Date;
  };

  @Column({
    type: 'enum',
    enum: ['BOOKED', 'DONE', 'PENDING', 'SCHEDULED', 'APPROVED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: string;

  @ManyToOne(() => VehicleEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: VehicleEntity;

  constructor(partial: Partial<ScheduleEntity>) {
    super();
    return Object.assign(this, {
      instractorTime: {
        hasStarted: false,
        hasEnded: false,
        startTime: new Date(),
        endTime: new Date(),
      },
      studentTime: {
        hasStarted: false,
        hasEnded: false,
        startTime: new Date(),
        endTime: new Date(),
      },
      ...partial,
    });
  }
}

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user';
import { BaseEntity } from '@app/shared';

@Entity('duty_dates')
export class DutyDateEntity extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor: UserEntity;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: ['Scheduled', 'Available', 'OnLive', 'Completed'],
    default: 'Available',
  })
  status: string;

  constructor(partial: Partial<DutyDateEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

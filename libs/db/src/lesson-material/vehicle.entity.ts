// vehicle.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { BaseEntity } from '@app/shared';

@Entity('vehicles')
export class VehicleEntity extends BaseEntity {
  @Column()
  name: string; // e.g. Toyota Yaris, Suzuki Alto

  @Column({ unique: true })
  plateNumber: string;

  @Column()
  type: string; // e.g. 'manual', 'automatic', 'motorbike'

  @Column()
  model: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  remarks?: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.vehicle)
  lessonSchedules: ScheduleEntity[];

  constructor(partial: Partial<VehicleEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

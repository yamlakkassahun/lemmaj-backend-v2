import { BaseEntity } from '@app/shared';
import { Entity, Column } from 'typeorm';

@Entity('courses')
export class CourseEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  label: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @Column({ type: 'int', nullable: false })
  length: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  constructor(partial: Partial<CourseEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

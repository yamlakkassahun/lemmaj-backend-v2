import { BaseEntity } from '@app/shared';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('packages')
export class PackageEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: false })
  packageCode: string;

  @Column({ type: 'decimal', nullable: true })
  price?: number;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @ManyToMany(() => CourseEntity, { cascade: true })
  @JoinTable({
    name: 'package_courses', // junction table
    joinColumn: { name: 'packageId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'courseId', referencedColumnName: 'id' },
  })
  courses: CourseEntity[];

  constructor(partial: Partial<PackageEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

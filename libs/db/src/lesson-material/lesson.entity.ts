import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, Unique } from 'typeorm';
import { BaseEntity, LESSON_STATUS, LessonStatusEnum } from '@app/shared';
import { PackageEntity } from './package.entity';
import { UserEntity } from '../user';

@Entity('lessons')
export class LessonEntity extends BaseEntity {
  @Column({
    name: 'instructor_id',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  instructorId?: number;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor?: UserEntity;

  @Column({ name: 'student_id', type: 'int', unsigned: true, nullable: false })
  studentId: number;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'student_id' })
  student: UserEntity;

  @ManyToOne(() => PackageEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'package_id', referencedColumnName: 'id' })
  package: PackageEntity;

  @Column({ name: 'package_id', type: 'int', unsigned: true, nullable: false })
  packageId: number;

  @Column({ name: 'certificate_url', type: 'varchar', length: 255, nullable: true })
  certificateUrl?: string;

  @Column({
    type: 'enum',
    enum: LESSON_STATUS,
    default: 'PENDING',
    nullable: false,
  })
  status: LessonStatusEnum;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  constructor(partial: Partial<LessonEntity>) {
    super();
    return Object.assign(this, partial);
  }
}

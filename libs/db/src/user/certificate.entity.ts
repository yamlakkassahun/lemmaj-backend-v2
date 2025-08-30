import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/shared';
import { UserEntity } from './user.entity';

@Entity('certificates')
export class CertificateEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'datetime', nullable: true })
  issuedDate: Date;

  @Column({ nullable: true })
  imageUrls?: string;

  @ManyToOne(() => UserEntity, (user) => user.certificates, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'role_id', nullable: false })
  userId: number;
}

import { BaseEntity } from '@app/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
    @Column()
    @ApiProperty()
    title: string;

    @Column({ nullable: true })
    @ApiPropertyOptional()
    description?: string;

    @Column({ default: true })
    isUnRead: boolean;

    @ManyToOne(() => UserEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: UserEntity;

    @Column({ name: 'user_id', type: 'int', unsigned: true, nullable: false })
    userId?: number;

    toDto() {
        return plainToClass(NotificationEntity, this);
    }

    toJSON() {
        return instanceToPlain(this);
    }

    constructor(partial: Partial<NotificationEntity>) {
        super();
        return Object.assign(this, partial);
    }
}

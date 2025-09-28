import { plainToClass, instanceToPlain } from "class-transformer";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "@app/shared";

@Entity('licenses')
export class LicenseEntity extends BaseEntity {
    @Column({ nullable: false })
    licenseName: string;

    @Column({ nullable: true })
    licensePic: string;

    @Column({ nullable: true })
    licenseBackPic: string;

    @Column({ nullable: true })
    registrationNo: string;

    @Column({ nullable: true })
    issuedDate: Date;

    @Column({ nullable: true })
    expiredDate: Date;

    @ManyToOne(() => UserEntity, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ name: 'user_id', nullable: true, unsigned: true })
    userId: number;

    toDto() {
        return plainToClass(LicenseEntity, this);
    }
    toJSON() {
        return instanceToPlain(this);
    }
    constructor(partial: Partial<LicenseEntity>) {
        super();
        return Object.assign(this, partial);
    }
}

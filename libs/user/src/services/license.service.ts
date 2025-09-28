import { LicenseEntity } from "@app/db";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginateQuery, Paginated, paginate } from "nestjs-paginate";
import { DataSource } from "typeorm";
import { CreateLicenseDto, licensePageConfig, UpdateLicenseDto } from "../dto";

@Injectable()
export class LicenseService {
    constructor(private readonly ds: DataSource) { }

    public async findAll(query: PaginateQuery): Promise<Paginated<LicenseEntity>> {
        return await paginate(
            query,
            this.ds.getRepository(LicenseEntity),
            licensePageConfig,
        );
    }

    async create(dto: CreateLicenseDto) {
        const cert = this.ds.getRepository(LicenseEntity).create({ ...dto });
        return this.ds.getRepository(LicenseEntity).save(cert);
    }

    async findOne(id: number) {
        return this.ds.getRepository(LicenseEntity).findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateLicenseDto) {
        const cert = await this.ds
            .getRepository(LicenseEntity)
            .findOne({ where: { id } });
        if (!cert) throw new NotFoundException('Certificate not found');
        const updated = this.ds.getRepository(LicenseEntity).merge(cert, dto);
        return this.ds.getRepository(LicenseEntity).save(updated);
    }

    async delete(id: number) {
        const cert = await this.ds
            .getRepository(LicenseEntity)
            .findOne({ where: { id } });
        if (!cert) throw new NotFoundException('Certificate not found');
        return this.ds.getRepository(LicenseEntity).remove(cert);
    }
}
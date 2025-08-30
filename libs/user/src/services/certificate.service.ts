import { CertificateEntity } from '@app/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCertificateDto, UpdateCertificateDto } from '../dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { certificatePageConfig } from '../dto/request-dto/certificate.dto';

@Injectable()
export class CertificateService {
  constructor(private readonly ds: DataSource) {}

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<CertificateEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(CertificateEntity),
      certificatePageConfig,
    );
  }

  async create(dto: CreateCertificateDto) {
    const cert = this.ds.getRepository(CertificateEntity).create({ ...dto });
    return this.ds.getRepository(CertificateEntity).save(cert);
  }

  async findOne(id: number) {
    return this.ds.getRepository(CertificateEntity).findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateCertificateDto) {
    const cert = await this.ds
      .getRepository(CertificateEntity)
      .findOne({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');
    const updated = this.ds.getRepository(CertificateEntity).merge(cert, dto);
    return this.ds.getRepository(CertificateEntity).save(updated);
  }

  async delete(id: number) {
    const cert = await this.ds
      .getRepository(CertificateEntity)
      .findOne({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');
    return this.ds.getRepository(CertificateEntity).remove(cert);
  }
}

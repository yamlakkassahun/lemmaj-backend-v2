import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { CreatePackageDto, packagePageConfig, UpdatePackageDto } from '../dtos';
import { CourseEntity, PackageEntity } from '@app/db';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class PackageService {
  constructor(private readonly ds: DataSource) { }

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<PackageEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(PackageEntity),
      packagePageConfig,
    );
  }

  public async findOne(id: number): Promise<PackageEntity> {
    const pkg = await this.ds
      .getRepository(PackageEntity)
      .findOne({ where: { id }, relations: ['courses'] });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  public async create(dto: CreatePackageDto): Promise<PackageEntity> {
    const courses = await this.ds
      .getRepository(CourseEntity)
      .findBy({ id: In(dto.courses) });

    const duration = courses.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.length;
    }, 0);

    const pkg = this.ds
      .getRepository(PackageEntity)
      .create({ ...dto, duration, courses });
    return await this.ds.getRepository(PackageEntity).save(pkg);
  }

  public async update(
    id: number,
    dto: UpdatePackageDto,
  ): Promise<PackageEntity> {
    const repo = this.ds.getRepository(PackageEntity);
    const pkg = await repo.findOne({ where: { id } });

    if (!pkg) throw new NotFoundException('Package not found');
    Object.assign(pkg, dto);
    if (dto.courses !== undefined) {
      const courses = await this.ds
        .getRepository(CourseEntity)
        .findBy({ id: In(dto.courses) });

      const duration = courses.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.length;
      }, 0);

      pkg.courses = courses;
      pkg.duration = duration;
    }
    await repo.save(pkg);
    return await repo.findOneOrFail({
      where: { id: pkg.id },
      relations: ['courses'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.ds.getRepository(PackageEntity).delete(id);
    if (result.affected === 0) throw new NotFoundException('Package not found');
  }
}

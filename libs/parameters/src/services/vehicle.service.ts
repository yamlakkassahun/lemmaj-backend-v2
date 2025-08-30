import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  vehiclePageConfig,
} from '../dtos/vehicle-dto';
import { VehicleEntity } from '@app/db';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class VehicleService {
  constructor(private readonly ds: DataSource) {}

  async create(dto: CreateVehicleDto): Promise<VehicleEntity> {
    const vehicle = this.ds.getRepository(VehicleEntity).create(dto);
    return this.ds.getRepository(VehicleEntity).save(vehicle);
  }

  public async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<VehicleEntity>> {
    return await paginate(
      query,
      this.ds.getRepository(VehicleEntity),
      vehiclePageConfig,
    );
  }

  async findOne(id: number): Promise<VehicleEntity> {
    const vehicle = await this.ds
      .getRepository(VehicleEntity)
      .findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: number, dto: UpdateVehicleDto): Promise<VehicleEntity> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, dto);
    return this.ds.getRepository(VehicleEntity).save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.ds.getRepository(VehicleEntity).remove(vehicle);
  }
}

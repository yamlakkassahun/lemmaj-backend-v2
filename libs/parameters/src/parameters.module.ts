import { Module } from '@nestjs/common';
import {
  LeaveController,
  LicenseTypeController,
  NotificationController,
  RegionController,
  SubCityController,
  VehicleController,
} from './controllers';
import {
  LeaveService,
  LicenseTypeService,
  NotificationService,
  RegionService,
  SubCityService,
  VehicleService,
} from './services';

const controllers = [
  LeaveController,
  RegionController,
  SubCityController,
  VehicleController,
  NotificationController,
  LicenseTypeController,
];
const providers = [
  LeaveService,
  RegionService,
  SubCityService,
  VehicleService,
  LicenseTypeService,
  NotificationService,
];

@Module({
  controllers,
  providers,
  exports: providers,
})
export class ParametersModule { }

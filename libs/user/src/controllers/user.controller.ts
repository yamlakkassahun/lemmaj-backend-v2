/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/create-user.service';
import { RegisterAdminDto, userPageConfig } from '../dto/request-dto';
import { AdministrativeUserBuilder } from '../dto/base/admins-builder';
import {
  Public,
  stripImagesPrefix,
  UploadProfileAndLicenseFiles,
  UploadProfilePicture,
} from '@app/shared';
import { UserEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';
import { GetUserService } from '../services';
import {
  UpdateAdminDto,
  UpdateAdminPayload,
} from '../dto/request-dto/update-user.dto';

@ApiTags('User')
@ApiCookieAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly getUserService: GetUserService,
  ) { }

  @Get()
  @ApiOkPaginatedResponse(UserEntity, userPageConfig)
  @ApiPaginationQuery(userPageConfig)
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return this.getUserService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.getUserService.getBy({ id });
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UploadProfilePicture()
  async registerCompanyUser(
    @Body() dto: RegisterAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.profilePic = stripImagesPrefix(file?.path);
    const builder = new AdministrativeUserBuilder({ ...dto });
    const user = await this.userService.createUser(builder);
    // const smsPayload = builder.getNotificationDetail(user.id);
    // await this.notify.sendAuthSMS(smsPayload);
    // await this.notify.sendWelcomeEmail(
    //   user,
    //   smsPayload.otpCode,
    //   smsPayload.password,
    // );
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @UploadProfileAndLicenseFiles()
  async updateOwnProfile(
    @UploadedFiles()
    files: {
      profilePic?: Express.Multer.File[];
      licensePic?: Express.Multer.File[];
      licenseBackPic?: Express.Multer.File[];
    },
    @Body() dto: UpdateAdminDto,
    @Param('id') id: number,
  ): Promise<UserEntity> {
    const _dto = { id };
    dto.profilePic = stripImagesPrefix(files.profilePic?.[0].path);
    dto.licensePic = stripImagesPrefix(files.licensePic?.[0].path);
    dto.licenseBackPic = stripImagesPrefix(files.licenseBackPic?.[0].path);
    const data = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException(
        'Unavailable or Forbidden resource access',
        HttpStatus.FORBIDDEN,
      );
    }
    const payload = new UpdateAdminPayload(dto, id);
    const result = await this.userService.updateUser(payload);
    return result;
  }
}

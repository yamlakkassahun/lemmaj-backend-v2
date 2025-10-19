import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService, TokenService } from '../services';
import { LoginDto, UpdatePasswordDto } from '../dto';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import {
  GetUser,
  Public,
  ROLE,
  Roles,
  stripImagesPrefix,
  UploadProfileAndLicenseFiles,
} from '@app/shared';
import { GetUserService, UserService } from '@app/user';
import { StudentBuilder } from '@app/user/dto/base/admins-builder';
import {
  RegisterStudentDto,
  UpdateAdminDto,
  UpdateAdminPayload,
} from '@app/user/dto';
import { UserEntity } from '@app/db';

@ApiTags('Auth')
@ApiCookieAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokeService: TokenService,
    private readonly userService: UserService,
    private readonly getUserService: GetUserService,
  ) { }

  private _setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string } | undefined,
  ) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
    };
    if (tokens) {
      res.cookie('accessToken', tokens.accessToken, cookieOptions);
      res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    }
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UploadProfileAndLicenseFiles()
  async registerCompanyUser(
    @Body() dto: RegisterStudentDto,
    @UploadedFiles()
    files?: {
      profilePic?: Express.Multer.File[];
      licensePic?: Express.Multer.File[];
      licenseBackPic?: Express.Multer.File[];
    },
  ) {
    dto.profilePic = stripImagesPrefix(files?.profilePic?.[0].path);
    dto.licensePic = stripImagesPrefix(files?.licensePic?.[0].path);
    dto.licenseBackPic = stripImagesPrefix(files?.licenseBackPic?.[0].path);

    const builder = new StudentBuilder({
      ...dto,
    });

    const user = await this.userService.createUser(builder);
    return user;
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('Access Access Ristricted!');
    const tokens = await this.tokeService.createTokenPair(user);
    if (!tokens) throw new BadRequestException('User Not Found');
    this._setAuthCookies(res, tokens);
    return { message: 'Logged in successfully' };
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.['refreshToken'];
    if (!token) throw new UnauthorizedException('No refresh token found');
    try {
      const tokens = await this.tokeService.validRefreshToken(token);
      this._setAuthCookies(res, tokens);
      return { message: 'Token refreshed' };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    this._setAuthCookies(res, { accessToken: '', refreshToken: '' });
    return { message: 'Logged in successfully' };
  }

  @Roles(...ROLE)
  @Get('profile')
  async getProfile(@GetUser() user: any) {
    const id = user.uid;
    const _user = await this.getUserService.getBy({ id });
    return _user;
  }

  @Put('profile')
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
    @GetUser() user: any,
  ): Promise<UserEntity> {
    const id = user.uid;
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

  @Put('update-password')
  @Roles(...ROLE)
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  async updatePassword(@GetUser() user: any, @Body() dto: UpdatePasswordDto) {
    const id = user.uid;
    return this.userService.updatePassword(id, dto);
  }
}


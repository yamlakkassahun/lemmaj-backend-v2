// certificate.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CertificateService } from '../services';
import {
  certificatePageConfig,
  CreateCertificateDto,
  UpdateCertificateDto,
} from '../dto';
import { Public, stripImagesPrefix, UploadCertificateFiles } from '@app/shared';
import { CertificateEntity } from '@app/db';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificateController {
  constructor(private readonly service: CertificateService) { }

  @Get()
  @Public()
  @ApiOkPaginatedResponse(CertificateEntity, certificatePageConfig)
  @ApiPaginationQuery(certificatePageConfig)
  findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<CertificateEntity>> {
    return this.service.findAll(query);
  }

  @Post()
  @Public()
  @UploadCertificateFiles()
  @ApiOperation({ summary: 'Create a certificate' })
  async create(
    @Body() dto: CreateCertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.imageUrls = stripImagesPrefix(file?.path);
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a certificate by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const cert = await this.service.findOne(id);
    if (!cert) throw new NotFoundException('Certificate not found');
    return cert;
  }

  @Put(':id')
  @UploadCertificateFiles()
  @ApiOperation({ summary: 'Update a certificate' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    dto.imageUrls = stripImagesPrefix(file?.path);
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a certificate' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}

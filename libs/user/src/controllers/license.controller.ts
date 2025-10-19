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
    UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LicenseService } from '../services';
import {
    CreateLicenseDto,
    licensePageConfig,
    UpdateCertificateDto,
    UpdateLicenseDto,
} from '../dto';
import { Public, stripImagesPrefix, UploadCertificateFiles, UploadProfileAndLicenseFiles } from '@app/shared';
import { LicenseEntity } from '@app/db';
import {
    ApiOkPaginatedResponse,
    ApiPaginationQuery,
    Paginate,
    PaginateQuery,
    Paginated,
} from 'nestjs-paginate';

@ApiTags('license')
@Controller('license')
export class LicenseController {
    constructor(private readonly service: LicenseService) { }

    @Get()
    @Public()
    @ApiOkPaginatedResponse(LicenseEntity, licensePageConfig)
    @ApiPaginationQuery(licensePageConfig)
    findAll(
        @Paginate() query: PaginateQuery,
    ): Promise<Paginated<LicenseEntity>> {
        return this.service.findAll(query);
    }

    @Post()
    @UploadProfileAndLicenseFiles()
    @ApiOperation({ summary: 'Create a license' })
    async create(
        @Body() dto: CreateLicenseDto,
        @UploadedFiles()
        files: {
            profilePic?: Express.Multer.File[];
            licensePic?: Express.Multer.File[];
            licenseBackPic?: Express.Multer.File[];
        },
    ) {
        dto.licensePic = stripImagesPrefix(files.licensePic?.[0].path);
        dto.licenseBackPic = stripImagesPrefix(files.licenseBackPic?.[0].path);
        return this.service.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a license by ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const cert = await this.service.findOne(id);
        if (!cert) throw new NotFoundException('license not found');
        return cert;
    }

    @Put(':id')
    @UploadCertificateFiles()
    @ApiOperation({ summary: 'Update a license' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLicenseDto,
        @UploadedFiles()
        files?: {
            profilePic?: Express.Multer.File[];
            licensePic?: Express.Multer.File[];
            licenseBackPic?: Express.Multer.File[];
        },
    ) {
        dto.licensePic = stripImagesPrefix(files?.licensePic?.[0].path);
        dto.licenseBackPic = stripImagesPrefix(files?.licenseBackPic?.[0].path);
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a license' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}

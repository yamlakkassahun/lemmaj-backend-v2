// src/common/decorators/upload-files.decorator.ts

import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function UploadProfileAndLicenseFiles() {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'profilePic', maxCount: 1 },
          { name: 'licensePic', maxCount: 1 },
          { name: 'licenseBackPic', maxCount: 1 },
        ],
        {
          storage: diskStorage({
            destination: './images/uploads',
            filename: (req, file, cb) => {
              const ext = extname(file.originalname);
              const name = file.originalname
                .replace(/\s+/g, '_')
                .replace(ext, '');
              cb(null, `${name}_${Date.now()}${ext}`);
            },
          }),
        },
      ),
    ),
  );
}

export function UploadProfilePicture() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('profilePic', {
        storage: diskStorage({
          destination: './images/uploads',
          filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            const name = file.originalname
              .replace(/\s+/g, '_')
              .replace(ext, '');
            cb(null, `${name}_${Date.now()}${ext}`);
          },
        }),
      }),
    ),
  );
}

export function UploadCertificateFiles() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('imageUrls', {
        storage: diskStorage({
          destination: './images/uploads',
          filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            const name = file.originalname
              .replace(/\s+/g, '_')
              .replace(ext, '');
            cb(null, `${name}_${Date.now()}${ext}`);
          },
        }),
      }),
    ),
  );
}

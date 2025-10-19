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
              const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
              cb(null, `${randomName}${extname(file.originalname || '')}`);
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
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname || '')}`);
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
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname || '')}`);
          },
        }),
      }),
    ),
  );
}

import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ENDPOINT } from '../constants';

export const Public = () => SetMetadata(PUBLIC_ENDPOINT, true);

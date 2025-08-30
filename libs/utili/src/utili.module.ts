import { Module } from '@nestjs/common';
import { UtiliService } from './utili.service';

@Module({
  providers: [UtiliService],
  exports: [UtiliService],
})
export class UtiliModule {}

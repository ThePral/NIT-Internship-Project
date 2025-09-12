import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { AllocationService } from './allocation.service';
import { SrPdfService } from './srpdf.service';
import { PuppeteerService } from './puppeteer.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports:[RedisModule],
  providers: [ImportService, AllocationService, SrPdfService, PuppeteerService  ],
  exports: [ImportService, AllocationService, SrPdfService],
})
export class AdmissionsModule {}

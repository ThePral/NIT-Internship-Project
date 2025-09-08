import { Global, Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { AdminService } from 'src/admin/admin.service';
import { ImportWorker } from './import.worker';
import { AdmissionsModule } from 'src/admissions/admissions.module';

@Global()
@Module({
  controllers: [QueueController],
  providers: [QueueService, AdminService, ImportWorker],
  exports: [QueueService],
  imports: [AdmissionsModule]
})
export class QueueModule {}

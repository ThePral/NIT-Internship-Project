import { Global, Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { AdminService } from 'src/admin/admin.service';
import { ImportWorker } from './import.worker';
import { AdmissionsModule } from 'src/admissions/admissions.module';
import { HistoryWorker } from './history.worker';
import { HashPasswordsWorker } from './hashpasswords.worker';

@Global()
@Module({
  controllers: [QueueController],
  providers: [QueueService, AdminService, ImportWorker, HistoryWorker, HashPasswordsWorker],
  exports: [QueueService],
  imports: [AdmissionsModule]
})
export class QueueModule {}

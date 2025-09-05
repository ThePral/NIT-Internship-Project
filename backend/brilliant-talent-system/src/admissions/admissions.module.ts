import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { AllocationService } from './allocation.service';

@Module({
  providers: [ImportService, AllocationService],
  exports: [ImportService, AllocationService]
})
export class AdmissionsModule {}

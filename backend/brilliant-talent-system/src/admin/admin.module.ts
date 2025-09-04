import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ImportService } from 'src/admissions/import.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ImportService]
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdmissionsModule } from 'src/admissions/admissions.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [AdmissionsModule]
})
export class AdminModule {}

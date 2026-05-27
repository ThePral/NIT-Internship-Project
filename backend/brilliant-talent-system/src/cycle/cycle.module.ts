import { Module } from '@nestjs/common';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  controllers: [CycleController],
  providers: [CycleService],
  imports: [AdminModule]
})
export class CycleModule {}

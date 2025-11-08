import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SuperAdminService } from 'src/superAdmin/superAdmin.service';
import { SuperAdminModule } from 'src/superAdmin/superAdmin.mudule';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AdmissionsModule } from 'src/admissions/admissions.module';

@Module({
  imports: [AdmissionsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

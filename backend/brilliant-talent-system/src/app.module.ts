import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './logger';
import { UserModule } from './user/user.module';
import { SuperAdminModule } from './superAdmin/superAdmin.mudule';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { AdmissionsModule } from './admissions/admissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    PrismaModule, 
    UserModule, 
    SuperAdminModule, 
    AdminModule, 
    AdmissionsModule
  ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
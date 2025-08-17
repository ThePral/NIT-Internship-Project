import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './logger';
import { UserModule } from './user/user.module';
import { SuperAdminModule } from './superAdmin/superAdmin.mudule';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, SuperAdminModule, AdminModule]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
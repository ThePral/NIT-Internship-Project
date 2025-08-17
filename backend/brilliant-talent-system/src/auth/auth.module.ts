import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy, SuperAdminJwtStrategy, UserJwtStrategy } from './strategy';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, UserJwtStrategy, AdminJwtStrategy, SuperAdminJwtStrategy]
})
export class AuthModule {}

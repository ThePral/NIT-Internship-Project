import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import * as argon from 'argon2'
import { AdminLoginDto, SuperAdminLoginDto, UserLoginDto } from "./dto";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async userLogin(dto: UserLoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username,
            },
        });

        if (!user) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        const pwMatches = await argon.verify(user.hash_password, dto.password);
        
        if (!pwMatches) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        return this.generateTokens(user.id, user.username, 'user');
    }

    async adminLogin(dto: AdminLoginDto) {
        const admin = await this.prisma.admin.findUnique({
            where: {
                username: dto.username,
            },
        });

        if (!admin) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        const pwMatches = await argon.verify(admin.hash_password, dto.password);
        
        if (!pwMatches) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        return this.generateTokens(admin.id, admin.username, 'admin');
    }

    async superAdminLogin(dto: SuperAdminLoginDto) {
        const superAdmin = await this.prisma.superAdmin.findUnique({
            where: {
                username: dto.username,
            },
        });

        if (!superAdmin) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        const pwMatches = await argon.verify(superAdmin.hash_password, dto.password);
        
        if (!pwMatches) {
            throw new ForbiddenException('Creditentioal incorrrect');
        }

        return this.generateTokens(superAdmin.id, superAdmin.username, 'superAdmin');
    }

    async generateTokens(
        userId: number,
        username: string,
        role: string
    ) {
        const accessTokenPayload = {
            sub: userId,
            username, role
        };

        const refreshTokenPayload = {
            sub: userId,
            username,
            role,
            isRefreshToken: true
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(accessTokenPayload, {
                expiresIn: '15m',
                secret: process.env.JWT_ACCESS_SECRET
            }),
            this.jwt.signAsync(refreshTokenPayload, {
                expiresIn: '7d',
                secret: process.env.JWT_REFRESH_SECRET
            })
        ]);

        return {
            access_token,
            refresh_token
        };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });

            if (!payload.isRefreshToken) {
                throw new ForbiddenException('Invalid token type');
            }

            return this.generateTokens(payload.sub, payload.username, payload.role);
        } catch (error) {
            throw new ForbiddenException('Invalid or expired refresh token');
        }
    }
}
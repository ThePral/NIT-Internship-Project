import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import * as argon from 'argon2'
import { AdminLoginDto, SuperAdminLoginDto, UserLoginDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


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

        return this.createToken(user.id, user.username);
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

        return this.createToken(admin.id, admin.username);
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

        return this.createToken(superAdmin.id, superAdmin.username);
    }

    async createToken(
        userId: number,
        username: string
    ) {

        const payload = {
            sub: userId,
            username,
        };

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '100m',
                secret: process.env.JWT_SECRET
            },
        );

        return {
            access_token: token,
            refresh_token: token
        };
    }
}
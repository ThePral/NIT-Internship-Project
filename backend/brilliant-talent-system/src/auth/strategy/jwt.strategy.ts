import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class UserJwtStrategy extends PassportStrategy(
    Strategy,
    'user_jwt'
) {
    
    constructor(private prisma: PrismaService) {
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        })
    };

    async validate(payload: {
        sub: number,
        username: string,
        role: string
    }) {
        if(payload.role !== 'user') throw new UnauthorizedException();
        
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        if (!user) throw new UnauthorizedException();
        
        return user;
    }
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
    Strategy,
    'admin_jwt'
) {
    
    constructor(private prisma: PrismaService) {
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        })
    };

    async validate(payload: {
        sub: number,
        username: string,
        role: string
    }) {
        if(payload.role !== 'admin') throw new UnauthorizedException();
        
        const admin = await this.prisma.admin.findUnique({
            where: {
                id: payload.sub,
            }
        })
        if (!admin) throw new UnauthorizedException();
        
        return admin;
    }
}

@Injectable()
export class SuperAdminJwtStrategy extends PassportStrategy(
    Strategy,
    'superAdmin_jwt'
) {
    
    constructor(private prisma: PrismaService) {
        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        })
    };

    async validate(payload: {
        sub: number,
        username: string,
        role: string
    }) {
        if(payload.role !== 'superAdmin') throw new UnauthorizedException();
        
        const superAdmin = await this.prisma.superAdmin.findUnique({
            where: {
                id: payload.sub,
            }
        })
        if (!superAdmin) throw new UnauthorizedException();
        
        return superAdmin;
    }
}
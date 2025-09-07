import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class UserJwtGuard extends AuthGuard('user_jwt') {
    constructor() {
        super();
    };

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException('دسترسی غیر مجاز');
        }
        return user;
    }
}

export class AdminJwtGuard extends AuthGuard('admin_jwt') {
    constructor() {
        super();
    };

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException('دسترسی غیر مجاز');
        }
        return user;
    }
}

export class SuperAdminJwtGuard extends AuthGuard('superAdmin_jwt') {
    constructor() {
        super();
    };

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException('دسترسی غیر مجاز');
        }
        return user;
    }
}

export class AnyAdminJwtGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const adminGuard = new AdminJwtGuard;
        const superAdminGuard = new SuperAdminJwtGuard;
        
        try {
            const adminResult = await adminGuard.canActivate(context);
            return Boolean(adminResult);
        } catch {}
        
        try {
            const superAdminResult = await superAdminGuard.canActivate(context);
            return Boolean(superAdminResult);
        } catch {
            throw new UnauthorizedException('دسترسی غیر مجاز');
        }
    }
}
import { AuthGuard } from "@nestjs/passport";

export class UserJwtGuard extends AuthGuard('user_jwt') {
    constructor() {
        super();
    };
}

export class AdminJwtGuard extends AuthGuard('admin_jwt') {
    constructor() {
        super();
    };
}

export class SuperAdminJwtGuard extends AuthGuard('superAdmin_jwt') {
    constructor() {
        super();
    };
}